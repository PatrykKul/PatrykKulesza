'use client';

/**
 * WhiteboardCanvas - Professional whiteboard in Miro style
 * Features:
 * - Selection mode - click to select and edit objects
 * - Text: draw area (like rectangle), type directly
 * - Click text again to edit or delete
 * - Zoom 10-100% with smooth controls
 * - Pan (drag canvas)
 * - Infinite canvas with grid
 * - Professional toolbar
 * - Drawing: pen, eraser, shapes (with fill option), text
 * - Draggable calculator
 * - Undo/Redo/Clear with full history
 * - Keyboard shortcuts
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import Toolbar, { Tool, ShapeType } from './Toolbar';

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  id: string;
  type: 'path';
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

interface Shape {
  id: string;
  type: 'shape';
  shapeType: ShapeType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  strokeWidth: number;
  fill: boolean;
}

interface TextElement {
  id: string;
  type: 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  color: string;
}

type DrawingElement = DrawingPath | Shape | TextElement;

interface ViewportTransform {
  x: number;
  y: number;
  scale: number;
}

interface HistoryState {
  elements: DrawingElement[];
}

interface WhiteboardCanvasProps {
  problemId?: string;
  className?: string;
}

export default function WhiteboardCanvas({ problemId, className = '' }: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Viewport & Transform
  const [viewport, setViewport] = useState<ViewportTransform>({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('select');
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [fontSize, setFontSize] = useState(24);
  const [fillShape, setFillShape] = useState(false);
  
  // Elements
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Text editing state
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textDraft, setTextDraft] = useState('');
  const [textBoxBounds, setTextBoxBounds] = useState<{x: number; y: number; width: number; height: number} | null>(null);
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcPosition, setCalcPosition] = useState({ x: 100, y: 100 });
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcValue, setCalcValue] = useState<number | null>(null);
  const [calcOperation, setCalcOperation] = useState<string | null>(null);
  const [isDraggingCalc, setIsDraggingCalc] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        redrawCanvas();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
    };
  }, []);
  
  // Wheel event for zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleWheelEvent = (e: WheelEvent) => {
      if (editingTextId) return; // Don't zoom while editing text
      
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const screenPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      const canvasPointBefore = screenToCanvas(screenPoint.x, screenPoint.y);
      
      const zoomIntensity = 0.1;
      const delta = -e.deltaY;
      const scaleChange = 1 + (delta > 0 ? zoomIntensity : -zoomIntensity);
      
      const newScale = Math.min(Math.max(viewport.scale * scaleChange, 0.1), 1);
      
      const canvasPointAfter = {
        x: (screenPoint.x - viewport.x) / newScale,
        y: (screenPoint.y - viewport.y) / newScale
      };
      
      const newX = viewport.x + (canvasPointBefore.x - canvasPointAfter.x) * newScale;
      const newY = viewport.y + (canvasPointBefore.y - canvasPointAfter.y) * newScale;
      
      setViewport({
        x: newX,
        y: newY,
        scale: newScale
      });
    };
    
    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheelEvent);
    };
  }, [viewport, editingTextId]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts while editing text
      if (editingTextId || textBoxBounds) return;
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          e.preventDefault();
          deleteElement(selectedElementId);
        }
      } else if (e.key === 'Escape') {
        setSelectedElementId(null);
        setTextBoxBounds(null);
        setEditingTextId(null);
      } else {
        // Tool shortcuts
        switch (e.key.toLowerCase()) {
          case 'v': setTool('select'); break;
          case 'h': setTool('pan'); break;
          case 'p': setTool('pen'); break;
          case 'e': setTool('eraser'); break;
          case 's': setTool('shape'); break;
          case 't': setTool('text'); break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, editingTextId, textBoxBounds, historyIndex, history]);
  
  // Auto-focus text input when editing
  useEffect(() => {
    if (textBoxBounds && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [textBoxBounds]);
  
  const screenToCanvas = useCallback((screenX: number, screenY: number): Point => {
    return {
      x: (screenX - viewport.x) / viewport.scale,
      y: (screenY - viewport.y) / viewport.scale
    };
  }, [viewport]);
  
  const canvasToScreen = useCallback((canvasX: number, canvasY: number): Point => {
    return {
      x: canvasX * viewport.scale + viewport.x,
      y: canvasY * viewport.scale + viewport.y
    };
  }, [viewport]);
  
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    drawGrid(ctx, rect.width, rect.height);
    
    ctx.save();
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.scale, viewport.scale);
    
    // Draw all elements
    [...elements, ...(currentElement ? [currentElement] : [])].forEach(element => {
      if (element.type === 'path') {
        drawPath(ctx, element);
      } else if (element.type === 'shape') {
        drawShape(ctx, element, element.id === selectedElementId);
      } else if (element.type === 'text' && element.id !== editingTextId) {
        drawText(ctx, element, element.id === selectedElementId);
      }
    });
    
    // Draw text box outline while creating
    if (textBoxBounds && !editingTextId) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / viewport.scale;
      ctx.setLineDash([5 / viewport.scale, 5 / viewport.scale]);
      ctx.strokeRect(textBoxBounds.x, textBoxBounds.y, textBoxBounds.width, textBoxBounds.height);
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  }, [elements, viewport, currentElement, selectedElementId, textBoxBounds, editingTextId]);
  
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);
  
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20 * viewport.scale;
    const offsetX = viewport.x % gridSize;
    const offsetY = viewport.y % gridSize;
    
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    for (let x = offsetX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };
  
  const drawPath = (ctx: CanvasRenderingContext2D, path: DrawingPath) => {
    if (path.points.length < 2) return;
    
    ctx.strokeStyle = path.tool === 'eraser' ? '#ffffff' : path.color;
    ctx.lineWidth = path.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);
    
    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i].x, path.points[i].y);
    }
    
    ctx.stroke();
  };
  
  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, isSelected: boolean) => {
    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const width = shape.endX - shape.startX;
    const height = shape.endY - shape.startY;
    
    ctx.beginPath();
    
    switch (shape.shapeType) {
      case 'rectangle':
        ctx.rect(shape.startX, shape.startY, width, height);
        break;
        
      case 'circle':
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = shape.startX + width / 2;
        const centerY = shape.startY + height / 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        break;
        
      case 'triangle':
        const topX = shape.startX + width / 2;
        const topY = shape.startY;
        const bottomLeftX = shape.startX;
        const bottomLeftY = shape.endY;
        const bottomRightX = shape.endX;
        const bottomRightY = shape.endY;
        
        ctx.moveTo(topX, topY);
        ctx.lineTo(bottomRightX, bottomRightY);
        ctx.lineTo(bottomLeftX, bottomLeftY);
        ctx.closePath();
        break;
        
      case 'line':
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        break;
    }
    
    if (shape.fill && shape.shapeType !== 'line') {
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.stroke();
    
    // Draw selection box
    if (isSelected) {
      const minX = Math.min(shape.startX, shape.endX);
      const minY = Math.min(shape.startY, shape.endY);
      const maxX = Math.max(shape.startX, shape.endX);
      const maxY = Math.max(shape.startY, shape.endY);
      const padding = 5 / viewport.scale;
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / viewport.scale;
      ctx.setLineDash([5 / viewport.scale, 5 / viewport.scale]);
      ctx.strokeRect(minX - padding, minY - padding, maxX - minX + padding * 2, maxY - minY + padding * 2);
      ctx.setLineDash([]);
    }
  };
  
  const drawText = (ctx: CanvasRenderingContext2D, text: TextElement, isSelected: boolean) => {
    ctx.fillStyle = text.color;
    ctx.font = `${text.fontSize}px Arial`;
    ctx.textBaseline = 'top';
    
    const lines = text.text.split('\n');
    const lineHeight = text.fontSize * 1.2;
    
    lines.forEach((line, i) => {
      ctx.fillText(line, text.x, text.y + i * lineHeight);
    });
    
    // Draw selection box
    if (isSelected) {
      const padding = 5 / viewport.scale;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / viewport.scale;
      ctx.setLineDash([5 / viewport.scale, 5 / viewport.scale]);
      ctx.strokeRect(text.x - padding, text.y - padding, text.width + padding * 2, text.height + padding * 2);
      ctx.setLineDash([]);
    }
  };
  
  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };
  
  const findElementAtPoint = (canvasPoint: Point): DrawingElement | null => {
    // Check in reverse order (top element first)
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      
      if (element.type === 'text') {
        const padding = 5;
        if (canvasPoint.x >= element.x - padding &&
            canvasPoint.x <= element.x + element.width + padding &&
            canvasPoint.y >= element.y - padding &&
            canvasPoint.y <= element.y + element.height + padding) {
          return element;
        }
      } else if (element.type === 'shape') {
        const minX = Math.min(element.startX, element.endX);
        const minY = Math.min(element.startY, element.endY);
        const maxX = Math.max(element.startX, element.endX);
        const maxY = Math.max(element.startY, element.endY);
        const padding = 10;
        
        if (canvasPoint.x >= minX - padding &&
            canvasPoint.x <= maxX + padding &&
            canvasPoint.y >= minY - padding &&
            canvasPoint.y <= maxY + padding) {
          return element;
        }
      }
    }
    
    return null;
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (editingTextId) return; // Don't start drawing while editing text
    
    const screenPoint = getCanvasPoint(e);
    const canvasPoint = screenToCanvas(screenPoint.x, screenPoint.y);
    
    if (tool === 'pan' || e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      setLastPanPoint(screenPoint);
      return;
    }
    
    if (tool === 'select') {
      const element = findElementAtPoint(canvasPoint);
      if (element) {
        setSelectedElementId(element.id);
        
        // Double-click to edit text
        if (element.type === 'text') {
          const now = Date.now();
          const lastClick = (window as any).__lastClickTime || 0;
          if (now - lastClick < 300) { // 300ms for double-click
            startEditingText(element.id);
          }
          (window as any).__lastClickTime = now;
        }
      } else {
        setSelectedElementId(null);
      }
      return;
    }
    
    if (tool === 'text') {
      // Start dragging text box
      setIsDrawing(true);
      setTextBoxBounds({
        x: canvasPoint.x,
        y: canvasPoint.y,
        width: 0,
        height: 0
      });
      return;
    }
    
    if (tool === 'pen' || tool === 'eraser') {
      setIsDrawing(true);
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        type: 'path',
        points: [canvasPoint],
        color: color,
        width: lineWidth,
        tool: tool
      };
      setCurrentElement(newPath);
    } else if (tool === 'shape') {
      setIsDrawing(true);
      const newShape: Shape = {
        id: Date.now().toString(),
        type: 'shape',
        shapeType: selectedShape,
        startX: canvasPoint.x,
        startY: canvasPoint.y,
        endX: canvasPoint.x,
        endY: canvasPoint.y,
        color: color,
        strokeWidth: lineWidth,
        fill: fillShape
      };
      setCurrentElement(newShape);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const screenPoint = getCanvasPoint(e);
    
    if (isPanning) {
      if (lastPanPoint) {
        const dx = screenPoint.x - lastPanPoint.x;
        const dy = screenPoint.y - lastPanPoint.y;
        
        setViewport(prev => ({
          ...prev,
          x: prev.x + dx,
          y: prev.y + dy
        }));
        
        setLastPanPoint(screenPoint);
      }
      return;
    }
    
    if (!isDrawing) return;
    
    const canvasPoint = screenToCanvas(screenPoint.x, screenPoint.y);
    
    if (currentElement?.type === 'path') {
      setCurrentElement(prev => prev ? {
        ...prev,
        points: [...(prev as DrawingPath).points, canvasPoint]
      } as DrawingPath : null);
    } else if (currentElement?.type === 'shape') {
      setCurrentElement(prev => prev ? {
        ...prev,
        endX: canvasPoint.x,
        endY: canvasPoint.y
      } as Shape : null);
    } else if (textBoxBounds) {
      // Update text box size
      const width = canvasPoint.x - textBoxBounds.x;
      const height = canvasPoint.y - textBoxBounds.y;
      setTextBoxBounds({
        ...textBoxBounds,
        width,
        height
      });
    }
  };
  
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      setLastPanPoint(null);
      return;
    }
    
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentElement) {
      setElements(prev => [...prev, currentElement]);
      setCurrentElement(null);
      saveToHistory();
    } else if (textBoxBounds) {
      // Finalize text box - start editing
      const minWidth = 100;
      const minHeight = 30;
      
      const finalBounds = {
        x: textBoxBounds.width < 0 ? textBoxBounds.x + textBoxBounds.width : textBoxBounds.x,
        y: textBoxBounds.height < 0 ? textBoxBounds.y + textBoxBounds.height : textBoxBounds.y,
        width: Math.max(Math.abs(textBoxBounds.width), minWidth),
        height: Math.max(Math.abs(textBoxBounds.height), minHeight)
      };
      
      setTextBoxBounds(finalBounds);
      setTextDraft('');
    }
  };
  
  const startEditingText = (id: string) => {
    const element = elements.find(e => e.id === id);
    if (element && element.type === 'text') {
      setEditingTextId(id);
      setTextDraft(element.text);
      setTextBoxBounds({
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height
      });
      setSelectedElementId(null);
    }
  };
  
  const finishTextEditing = () => {
    if (!textBoxBounds) return;
    
    if (editingTextId) {
      // Update existing text
      if (textDraft.trim()) {
        setElements(prev => prev.map(el => 
          el.id === editingTextId && el.type === 'text'
            ? { ...el, text: textDraft }
            : el
        ));
        saveToHistory();
      } else {
        // Delete if empty
        deleteElement(editingTextId);
      }
      setEditingTextId(null);
    } else {
      // Create new text
      if (textDraft.trim()) {
        const newText: TextElement = {
          id: Date.now().toString(),
          type: 'text',
          x: textBoxBounds.x,
          y: textBoxBounds.y,
          width: textBoxBounds.width,
          height: textBoxBounds.height,
          text: textDraft.trim(),
          fontSize: fontSize,
          color: color
        };
        
        setElements(prev => [...prev, newText]);
        saveToHistory();
      }
    }
    
    setTextBoxBounds(null);
    setTextDraft('');
  };
  
  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedElementId(null);
    saveToHistory();
  };
  
  const saveToHistory = () => {
    const state: HistoryState = {
      elements: [...elements]
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setElements(prevState.elements);
      setHistoryIndex(historyIndex - 1);
    } else if (historyIndex === 0) {
      setElements([]);
      setHistoryIndex(-1);
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setElements(nextState.elements);
      setHistoryIndex(historyIndex + 1);
    }
  };
  
  const clearCanvas = () => {
    if (confirm('Czy na pewno chcesz wyczyścić całą tablicę?')) {
      setElements([]);
      setSelectedElementId(null);
      saveToHistory();
    }
  };
  
  const zoomIn = () => {
    setViewport(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 1)
    }));
  };
  
  const zoomOut = () => {
    setViewport(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.1)
    }));
  };
  
  // Calculator functions
  const calcInput = (num: string) => {
    setCalcDisplay(prev => prev === '0' ? num : prev + num);
  };
  
  const calcOp = (op: string) => {
    setCalcValue(parseFloat(calcDisplay));
    setCalcOperation(op);
    setCalcDisplay('0');
  };
  
  const calcEqual = () => {
    if (calcValue === null || calcOperation === null) return;
    const current = parseFloat(calcDisplay);
    let result = 0;
    switch (calcOperation) {
      case '+': result = calcValue + current; break;
      case '-': result = calcValue - current; break;
      case '*': result = calcValue * current; break;
      case '/': result = calcValue / current; break;
    }
    setCalcDisplay(result.toString());
    setCalcValue(null);
    setCalcOperation(null);
  };
  
  const calcClear = () => {
    setCalcDisplay('0');
    setCalcValue(null);
    setCalcOperation(null);
  };
  
  const handleCalcMouseDown = (e: React.MouseEvent) => {
    setIsDraggingCalc(true);
    setDragOffset({
      x: e.clientX - calcPosition.x,
      y: e.clientY - calcPosition.y
    });
  };
  
  const handleCalcMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingCalc) return;
    setCalcPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }, [isDraggingCalc, dragOffset]);
  
  const handleCalcMouseUp = () => {
    setIsDraggingCalc(false);
  };
  
  useEffect(() => {
    if (isDraggingCalc) {
      document.addEventListener('mousemove', handleCalcMouseMove);
      document.addEventListener('mouseup', handleCalcMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleCalcMouseMove);
        document.removeEventListener('mouseup', handleCalcMouseUp);
      };
    }
  }, [isDraggingCalc, handleCalcMouseMove]);
  
  return (
    <div ref={containerRef} className={`relative w-full h-full bg-white overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 w-full h-full touch-none"
        style={{
          cursor: tool === 'pan' || isPanning ? 'grab' : 
                  tool === 'select' ? 'default' : 'crosshair'
        }}
      />
      
      <Toolbar
        tool={tool}
        setTool={setTool}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        color={color}
        setColor={setColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fillShape={fillShape}
        setFillShape={setFillShape}
        onUndo={undo}
        onRedo={redo}
        onClear={clearCanvas}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        canUndo={historyIndex >= 0}
        canRedo={historyIndex < history.length - 1}
        zoom={viewport.scale}
        showCalculator={showCalculator}
        setShowCalculator={setShowCalculator}
      />
      
      {/* Text input overlay */}
      {textBoxBounds && (
        <div
          className="absolute bg-white border-2 border-blue-500 rounded shadow-lg overflow-hidden"
          style={{
            left: `${canvasToScreen(textBoxBounds.x, textBoxBounds.y).x}px`,
            top: `${canvasToScreen(textBoxBounds.x, textBoxBounds.y).y}px`,
            width: `${textBoxBounds.width * viewport.scale}px`,
            height: `${textBoxBounds.height * viewport.scale}px`,
            minWidth: '100px',
            minHeight: '30px'
          }}
        >
          <textarea
            ref={textInputRef}
            value={textDraft}
            onChange={(e) => setTextDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setTextBoxBounds(null);
                setTextDraft('');
                setEditingTextId(null);
              } else if (e.key === 'Enter' && e.ctrlKey) {
                finishTextEditing();
              }
            }}
            onBlur={finishTextEditing}
            placeholder="Wpisz tekst... (Ctrl+Enter aby zakończyć)"
            className="w-full h-full p-2 resize-none outline-none"
            style={{
              fontSize: `${fontSize * viewport.scale}px`,
              color: color,
              lineHeight: '1.2'
            }}
          />
        </div>
      )}
      
      {/* Calculator */}
      {showCalculator && (
        <div
          className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 w-64 z-50"
          style={{
            left: `${calcPosition.x}px`,
            top: `${calcPosition.y}px`,
            cursor: isDraggingCalc ? 'grabbing' : 'default'
          }}
        >
          <div
            onMouseDown={handleCalcMouseDown}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
          >
            <span className="text-white font-semibold">Kalkulator</span>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-white hover:bg-white/20 rounded p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="bg-gray-100 rounded-lg px-4 py-3 text-right border border-gray-200">
              <div className="text-2xl font-mono text-gray-800">{calcDisplay}</div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <button onClick={calcClear} className="col-span-2 bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-semibold transition-colors">C</button>
              <button onClick={() => calcOp('/')} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 font-semibold transition-colors">÷</button>
              <button onClick={() => calcOp('*')} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 font-semibold transition-colors">×</button>
              
              {[7, 8, 9].map(num => (
                <button key={num} onClick={() => calcInput(num.toString())} className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg py-3 font-medium transition-colors">{num}</button>
              ))}
              <button onClick={() => calcOp('-')} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 font-semibold transition-colors">−</button>
              
              {[4, 5, 6].map(num => (
                <button key={num} onClick={() => calcInput(num.toString())} className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg py-3 font-medium transition-colors">{num}</button>
              ))}
              <button onClick={() => calcOp('+')} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 font-semibold transition-colors">+</button>
              
              {[1, 2, 3].map(num => (
                <button key={num} onClick={() => calcInput(num.toString())} className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg py-3 font-medium transition-colors">{num}</button>
              ))}
              <button onClick={calcEqual} className="row-span-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-xl transition-colors">=</button>
              
              <button onClick={() => calcInput('0')} className="col-span-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg py-3 font-medium transition-colors">0</button>
              <button onClick={() => calcInput('.')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg py-3 font-medium transition-colors">.</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
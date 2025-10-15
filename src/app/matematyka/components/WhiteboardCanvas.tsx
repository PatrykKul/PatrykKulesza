'use client';

/**
 * WhiteboardCanvas - Zaawansowany whiteboard jak Miro/Excalidraw
 * Features:
 * - Zoom in/out (scroll wheel)
 * - Pan (drag canvas with mouse/touch)
 * - Infinite canvas
 * - Drawing, eraser, shapes, text
 * - Undo/Redo
 * - Export/Download
 * - Responsive & performance optimized
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  PenTool, Eraser, Trash2, Type, Square, Circle, Triangle, 
  Download, Undo, Redo, ZoomIn, ZoomOut, Move, Hand, Calculator, Minus, X
} from 'lucide-react';

type Tool = 'pen' | 'eraser' | 'text' | 'shape' | 'pan';
type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line';

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: 'pen' | 'eraser';
}

interface Shape {
  id: string;
  type: ShapeType;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  strokeWidth: number;
}

interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

interface ViewportTransform {
  x: number;
  y: number;
  scale: number;
}

interface HistoryState {
  paths: DrawingPath[];
  shapes: Shape[];
  textElements: TextElement[];
}

interface WhiteboardCanvasProps {
  problemId?: string;
  className?: string;
}

export default function WhiteboardCanvas({ problemId, className = '' }: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Viewport & Transform
  const [viewport, setViewport] = useState<ViewportTransform>({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  
  // Elements
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  
  // Text state
  const [fontSize, setFontSize] = useState(16);
  const [pendingText, setPendingText] = useState<{ x: number; y: number } | null>(null);
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Menu state
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  
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
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);
  
  // Add wheel event listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const screenPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      const canvasPointBefore = screenToCanvas(screenPoint.x, screenPoint.y);
      
      // Zoom factor
      const zoomIntensity = 0.1;
      const delta = -e.deltaY;
      const scaleChange = 1 + (delta > 0 ? zoomIntensity : -zoomIntensity);
      
      const newScale = Math.min(Math.max(viewport.scale * scaleChange, 0.1), 5);
      
      // Adjust viewport to zoom towards cursor
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
    
    // Add listener with { passive: false } to allow preventDefault
    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheelEvent);
    };
  }, [viewport]); // screenToCanvas is stable, no need in deps
  
  // Convert screen coordinates to canvas coordinates (accounting for viewport transform)
  const screenToCanvas = useCallback((screenX: number, screenY: number): Point => {
    return {
      x: (screenX - viewport.x) / viewport.scale,
      y: (screenY - viewport.y) / viewport.scale
    };
  }, [viewport]);
  
  // Convert canvas coordinates to screen coordinates
  const canvasToScreen = useCallback((canvasX: number, canvasY: number): Point => {
    return {
      x: canvasX * viewport.scale + viewport.x,
      y: canvasY * viewport.scale + viewport.y
    };
  }, [viewport]);
  
  // Redraw entire canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // Draw grid
    drawGrid(ctx, rect.width, rect.height);
    
    // Apply viewport transform
    ctx.save();
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.scale, viewport.scale);
    
    // Draw all paths
    paths.forEach(path => drawPath(ctx, path));
    
    // Draw current path (while drawing)
    if (currentPath) {
      drawPath(ctx, currentPath);
    }
    
    // Draw all shapes
    shapes.forEach(shape => drawShape(ctx, shape));
    
    // Draw current shape (while drawing)
    if (currentShape) {
      drawShape(ctx, currentShape);
    }
    
    // Draw text elements
    textElements.forEach(text => drawText(ctx, text));
    
    ctx.restore();
  }, [paths, shapes, textElements, viewport, currentPath, currentShape]);
  
  // Trigger redraw when anything changes (including current drawing preview)
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);
  
  // Draw grid background
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 20 * viewport.scale;
    const offsetX = viewport.x % gridSize;
    const offsetY = viewport.y % gridSize;
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = offsetX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };
  
  // Draw a path (pen or eraser)
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
  
  // Draw a shape
  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const width = shape.endX - shape.startX;
    const height = shape.endY - shape.startY;
    
    ctx.beginPath();
    
    switch (shape.type) {
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
    
    ctx.stroke();
  };
  
  // Draw text element
  const drawText = (ctx: CanvasRenderingContext2D, text: TextElement) => {
    ctx.fillStyle = text.color;
    ctx.font = `${text.fontSize}px Arial`;
    ctx.textBaseline = 'top';
    ctx.fillText(text.text, text.x, text.y);
  };
  
  // Get mouse/touch position relative to canvas
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
  
  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const screenPoint = getCanvasPoint(e);
    const canvasPoint = screenToCanvas(screenPoint.x, screenPoint.y);
    
    if (tool === 'pan' || e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      // Pan mode
      setIsPanning(true);
      setLastPanPoint(screenPoint);
      return;
    }
    
    if (tool === 'text') {
      // Place text
      setPendingText(canvasPoint);
      return;
    }
    
    if (tool === 'pen' || tool === 'eraser') {
      // Start drawing
      setIsDrawing(true);
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        points: [canvasPoint],
        color: color,
        width: lineWidth,
        tool: tool
      };
      setCurrentPath(newPath);
    } else if (tool === 'shape') {
      // Start shape
      setIsDrawing(true);
      const newShape: Shape = {
        id: Date.now().toString(),
        type: selectedShape,
        startX: canvasPoint.x,
        startY: canvasPoint.y,
        endX: canvasPoint.x,
        endY: canvasPoint.y,
        color: color,
        strokeWidth: lineWidth
      };
      setCurrentShape(newShape);
    }
  };
  
  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const screenPoint = getCanvasPoint(e);
    
    if (isPanning) {
      // Pan the viewport
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
    
    if (currentPath) {
      // Continue drawing path
      setCurrentPath(prev => prev ? {
        ...prev,
        points: [...prev.points, canvasPoint]
      } : null);
    } else if (currentShape) {
      // Update shape end point
      setCurrentShape(prev => prev ? {
        ...prev,
        endX: canvasPoint.x,
        endY: canvasPoint.y
      } : null);
    }
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      setLastPanPoint(null);
      return;
    }
    
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentPath) {
      // Save path
      setPaths(prev => [...prev, currentPath]);
      setCurrentPath(null);
      saveToHistory();
    } else if (currentShape) {
      // Save shape
      setShapes(prev => [...prev, currentShape]);
      setCurrentShape(null);
      saveToHistory();
    }
  };
  
  // Save current state to history
  const saveToHistory = () => {
    const state: HistoryState = {
      paths: [...paths],
      shapes: [...shapes],
      textElements: [...textElements]
    };
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setPaths(prevState.paths);
      setShapes(prevState.shapes);
      setTextElements(prevState.textElements);
      setHistoryIndex(historyIndex - 1);
    } else if (historyIndex === 0) {
      // Go to empty state
      setPaths([]);
      setShapes([]);
      setTextElements([]);
      setHistoryIndex(-1);
    }
  };
  
  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setPaths(nextState.paths);
      setShapes(nextState.shapes);
      setTextElements(nextState.textElements);
      setHistoryIndex(historyIndex + 1);
    }
  };
  
  // Clear canvas
  const clearCanvas = () => {
    if (confirm('Czy na pewno chcesz wyczyścić całą tablicę?')) {
      setPaths([]);
      setShapes([]);
      setTextElements([]);
      saveToHistory();
    }
  };
  
  // Zoom in
  const zoomIn = () => {
    setViewport(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, 5)
    }));
  };
  
  // Zoom out
  const zoomOut = () => {
    setViewport(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, 0.1)
    }));
  };
  
  // Reset zoom and pan
  const resetView = () => {
    setViewport({ x: 0, y: 0, scale: 1 });
  };
  
  // Download as image
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `whiteboard-${problemId || Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };
  
  // Handle text input submission
  const handleTextSubmit = (text: string) => {
    if (!pendingText || !text.trim()) {
      setPendingText(null);
      return;
    }
    
    const newText: TextElement = {
      id: Date.now().toString(),
      x: pendingText.x,
      y: pendingText.y,
      text: text.trim(),
      fontSize: fontSize,
      color: color
    };
    
    setTextElements(prev => [...prev, newText]);
    setPendingText(null);
    saveToHistory();
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
    <div ref={containerRef} className={`relative w-full h-full bg-white ${className}`}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-crosshair touch-none"
        style={{
          cursor: tool === 'pan' || isPanning ? 'grab' : 'crosshair'
        }}
      />
      
      {/* Toolbar - Left side */}
      <div className="absolute left-4 top-4 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-2 space-y-2">
        {/* Tool buttons */}
        <button
          onClick={() => setTool('pan')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'pan' ? 'bg-[#58a6ff] text-white' : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
          }`}
          title="Przesuwanie (Pan)"
        >
          <Hand className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setTool('pen')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'pen' ? 'bg-[#58a6ff] text-white' : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
          }`}
          title="Pisak"
        >
          <PenTool className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setTool('eraser')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'eraser' ? 'bg-[#58a6ff] text-white' : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
          }`}
          title="Gumka"
        >
          <Eraser className="w-5 h-5" />
        </button>
        
        <div className="relative">
          <button
            onClick={() => {
              setTool('shape');
              setShowShapeMenu(!showShapeMenu);
            }}
            className={`p-3 rounded-lg transition-colors ${
              tool === 'shape' ? 'bg-[#58a6ff] text-white' : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
            }`}
            title="Kształty"
          >
            {selectedShape === 'rectangle' && <Square className="w-5 h-5" />}
            {selectedShape === 'circle' && <Circle className="w-5 h-5" />}
            {selectedShape === 'triangle' && <Triangle className="w-5 h-5" />}
          </button>
          
          {showShapeMenu && (
            <div className="absolute left-full ml-2 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl p-2 space-y-2">
              <button
                onClick={() => { setSelectedShape('rectangle'); setShowShapeMenu(false); }}
                className="p-2 rounded hover:bg-[#21262d] text-gray-400 hover:text-white transition-colors block"
              >
                <Square className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setSelectedShape('circle'); setShowShapeMenu(false); }}
                className="p-2 rounded hover:bg-[#21262d] text-gray-400 hover:text-white transition-colors block"
              >
                <Circle className="w-5 h-5" />
              </button>
              <button
                onClick={() => { setSelectedShape('triangle'); setShowShapeMenu(false); }}
                className="p-2 rounded hover:bg-[#21262d] text-gray-400 hover:text-white transition-colors block"
              >
                <Triangle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setTool('text')}
          className={`p-3 rounded-lg transition-colors ${
            tool === 'text' ? 'bg-[#58a6ff] text-white' : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
          }`}
          title="Tekst"
        >
          <Type className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className={`p-3 rounded-lg transition-colors ${
            showCalculator ? 'bg-[#58a6ff] text-white' : 'text-gray-400 hover:text-white hover:bg-[#21262d]'
          }`}
          title="Kalkulator"
        >
          <Calculator className="w-5 h-5" />
        </button>
        
        <div className="border-t border-[#30363d] pt-2"></div>
        
        <button
          onClick={undo}
          disabled={historyIndex < 0}
          className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Cofnij (Ctrl+Z)"
        >
          <Undo className="w-5 h-5" />
        </button>
        
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Ponów (Ctrl+Y)"
        >
          <Redo className="w-5 h-5" />
        </button>
        
        <button
          onClick={clearCanvas}
          className="p-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-[#21262d] transition-colors"
          title="Wyczyść tablicę"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      {/* Zoom controls - Bottom left */}
      <div className="absolute left-4 bottom-4 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-2 flex items-center gap-2">
        <button
          onClick={zoomOut}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors"
          title="Oddal"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        
        <span className="text-sm text-gray-400 font-mono min-w-[50px] text-center">
          {Math.round(viewport.scale * 100)}%
        </span>
        
        <button
          onClick={zoomIn}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors"
          title="Przybliż"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        
        <button
          onClick={resetView}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors text-xs"
          title="Resetuj widok"
        >
          100%
        </button>
      </div>
      
      {/* Color & Size controls - Top right */}
      <div className="absolute right-4 top-4 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl p-3 space-y-3">
        <div>
          <label className="text-xs text-gray-400 block mb-2">Kolor</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-8 rounded cursor-pointer border border-[#30363d]"
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-400 block mb-2">Grubość: {lineWidth}px</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        {tool === 'text' && (
          <div>
            <label className="text-xs text-gray-400 block mb-2">Rozmiar: {fontSize}px</label>
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
        
        <button
          onClick={downloadCanvas}
          className="w-full p-2 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Pobierz
        </button>
      </div>
      
      {/* Text input modal */}
      {pendingText && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center" onClick={() => setPendingText(null)}>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 min-w-[300px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-semibold mb-4">Wpisz tekst</h3>
            <input
              type="text"
              autoFocus
              placeholder="Twój tekst..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2 text-white mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTextSubmit((e.target as HTMLInputElement).value);
                } else if (e.key === 'Escape') {
                  setPendingText(null);
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  handleTextSubmit(input?.value || '');
                }}
                className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Dodaj
              </button>
              <button
                onClick={() => setPendingText(null)}
                className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Draggable Calculator */}
      {showCalculator && (
        <div
          className="absolute bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl w-64 z-50"
          style={{
            left: `${calcPosition.x}px`,
            top: `${calcPosition.y}px`,
            cursor: isDraggingCalc ? 'grabbing' : 'grab'
          }}
        >
          {/* Header - Draggable */}
          <div
            onMouseDown={handleCalcMouseDown}
            className="bg-[#21262d] rounded-t-xl px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#58a6ff]" />
              <span className="text-sm font-semibold text-white">Kalkulator</span>
            </div>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Calculator Body */}
          <div className="p-4 space-y-3">
            {/* Display */}
            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-right">
              <div className="text-2xl font-mono text-white">{calcDisplay}</div>
            </div>
            
            {/* Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <button onClick={calcClear} className="col-span-2 bg-[#da3633] hover:bg-[#b62324] text-white rounded-lg py-2 font-semibold">C</button>
              <button onClick={() => calcOp('/')} className="bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg py-2 font-semibold">÷</button>
              <button onClick={() => calcOp('*')} className="bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg py-2 font-semibold">×</button>
              
              <button onClick={() => calcInput('7')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">7</button>
              <button onClick={() => calcInput('8')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">8</button>
              <button onClick={() => calcInput('9')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">9</button>
              <button onClick={() => calcOp('-')} className="bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg py-2 font-semibold">−</button>
              
              <button onClick={() => calcInput('4')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">4</button>
              <button onClick={() => calcInput('5')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">5</button>
              <button onClick={() => calcInput('6')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">6</button>
              <button onClick={() => calcOp('+')} className="bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg py-2 font-semibold">+</button>
              
              <button onClick={() => calcInput('1')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">1</button>
              <button onClick={() => calcInput('2')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">2</button>
              <button onClick={() => calcInput('3')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">3</button>
              <button onClick={calcEqual} className="row-span-2 bg-[#1f6feb] hover:bg-[#58a6ff] text-white rounded-lg font-bold text-xl">=</button>
              
              <button onClick={() => calcInput('0')} className="col-span-2 bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">0</button>
              <button onClick={() => calcInput('.')} className="bg-[#21262d] hover:bg-[#30363d] text-white rounded-lg py-2">.</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hint */}
      <div className="absolute right-4 bottom-4 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-xs text-gray-400">
        <p>💡 Scroll: Zoom | Przeciągnij: Rysuj | Ctrl+Przeciągnij: Przesuwaj</p>
      </div>
    </div>
  );
}

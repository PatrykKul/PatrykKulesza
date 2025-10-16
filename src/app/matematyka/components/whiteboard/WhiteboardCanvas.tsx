'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Toolbar, { Tool, ShapeType, ZoomControls } from './Toolbar';

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
  text: string;
  fontSize: number;
  color: string;
}

interface FunctionPlot {
  id: string;
  type: 'function';
  expression: string;
  color: string;
  strokeWidth: number;
  xRange: number;  // Range to plot (-xRange to +xRange)
  yRange: number;
}

type DrawingElement = DrawingPath | Shape | TextElement | FunctionPlot;

interface ViewportTransform {
  x: number;
  y: number;
  scale: number;
}

interface WhiteboardCanvasProps {
  className?: string;
  splitSize?: number;
  onToggleView?: () => void;
}

// Math expression evaluator
function evaluateExpression(expr: string, x: number): number {
  let processed = expr
    .replace(/\^/g, '**')
    .replace(/(\d)([a-z])/gi, '$1*$2')
    .replace(/\)(\d)/g, ')*$1')
    .replace(/(\d)\(/g, '$1*(');

  // Replace math functions
  const functions = ['sin', 'cos', 'tan', 'sqrt', 'abs', 'log', 'ln', 'exp', 'floor', 'ceil', 'round'];
  functions.forEach(fn => {
    const regex = new RegExp(`\\b${fn}\\b`, 'g');
    processed = processed.replace(regex, `Math.${fn}`);
  });

  processed = processed.replace(/\bpi\b/g, 'Math.PI');
  processed = processed.replace(/\be\b/g, 'Math.E');

  try {
    const func = new Function('x', `return ${processed}`);
    const result = func(x);
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }
    
    return result;
  } catch (e) {
    throw new Error('Cannot evaluate expression');
  }
}

export default function WhiteboardCanvas({ className = '', splitSize = 50, onToggleView }: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  
  const [viewport, setViewport] = useState<ViewportTransform>({ 
    x: 0,
    y: 0,
    scale: 1
  });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('select');
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangle');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [fontSize, setFontSize] = useState(24);
  const [fillShape, setFillShape] = useState(false);
  
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<Set<string>>(new Set());
  
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Point | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Point | null>(null);
  
  const [isEditingText, setIsEditingText] = useState(false);
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  const [textBoxSize, setTextBoxSize] = useState<{ width: number; height: number } | null>(null);
  const [textDraft, setTextDraft] = useState('');
  const [pendingTextId, setPendingTextId] = useState<string | null>(null);
  
  const [history, setHistory] = useState<DrawingElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<Point | null>(null);
  const [draggedElementsStart, setDraggedElementsStart] = useState<Map<string, DrawingElement>>(new Map());
  
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStartBounds, setResizeStartBounds] = useState<{ minX: number; minY: number; maxX: number; maxY: number } | null>(null);
  
  const redrawCanvasRef = useRef<() => void>(() => {});
  
  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const width = Math.ceil(rect.width);
      const height = Math.ceil(rect.height);
      
      const currentWidth = canvas.width / dpr;
      const currentHeight = canvas.height / dpr;
      if (Math.abs(width - currentWidth) < 1 && Math.abs(height - currentHeight) < 1) {
        return;
      }
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        redrawCanvasRef.current();
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateCanvasSize);
    });
    resizeObserver.observe(container);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      resizeObserver.disconnect();
    };
  }, []);
  
  // Wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (isEditingText) return;
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomIntensity = 0.1;
      const delta = -e.deltaY;
      const scaleChange = 1 + (delta > 0 ? zoomIntensity : -zoomIntensity);
      
      const oldScale = viewport.scale;
      const newScale = Math.min(Math.max(oldScale * scaleChange, 0.2), 2.0); // 20% do 200%
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseRelX = mouseX - centerX;
      const mouseRelY = mouseY - centerY;
      
      const worldX = viewport.x + mouseRelX / oldScale;
      const worldY = viewport.y + mouseRelY / oldScale;
      
      const newViewportX = worldX - mouseRelX / newScale;
      const newViewportY = worldY - mouseRelY / newScale;
      
      const newViewport = constrainViewport({
        x: newViewportX,
        y: newViewportY,
        scale: newScale
      });
      
      setViewport(newViewport);
    };
    
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [viewport, isEditingText]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingText) {
        if (e.key === 'Escape') {
          cancelTextInput();
        } else if (e.key === 'Enter') {
          finishTextInput();
        }
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        } else if (e.key === 'y') {
          e.preventDefault();
          redo();
        }
        // Tool shortcuts - wymagają Ctrl/Cmd
        else if (e.key === 'v') {
          e.preventDefault();
          setTool('select');
        } else if (e.key === 'h') {
          e.preventDefault();
          setTool('pan');
        } else if (e.key === 'p') {
          e.preventDefault();
          setTool('pen');
        } else if (e.key === 's') {
          e.preventDefault();
          setTool('shape');
        } else if (e.key === 't') {
          e.preventDefault();
          setTool('text');
        } else if (e.key === 'f') {
          e.preventDefault();
          setTool('function');
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId || selectedElementIds.size > 0) {
          e.preventDefault();
          deleteSelectedElement();
        }
      } else if (e.key === 'Escape') {
        setTool('select');
        setSelectedElementId(null);
        setSelectedElementIds(new Set());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, selectedElementIds, isEditingText, historyIndex]);
  
  const screenToCanvas = useCallback((screenX: number, screenY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = screenX - centerX;
    const relY = screenY - centerY;
    
    const worldX = viewport.x + relX / viewport.scale;
    const worldY = viewport.y + relY / viewport.scale;
    
    return { x: worldX, y: worldY };
  }, [viewport]);
  
  const canvasToScreen = useCallback((worldX: number, worldY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const relX = (worldX - viewport.x) * viewport.scale;
    const relY = (worldY - viewport.y) * viewport.scale;
    
    const screenX = rect.width / 2 + relX;
    const screenY = rect.height / 2 + relY;
    
    return { x: screenX, y: screenY };
  }, [viewport]);
  
  const getElementBounds = (element: DrawingElement) => {
    if (element.type === 'shape') {
      return {
        minX: Math.min(element.startX, element.endX),
        maxX: Math.max(element.startX, element.endX),
        minY: Math.min(element.startY, element.endY),
        maxY: Math.max(element.startY, element.endY)
      };
    } else if (element.type === 'path') {
      return getBoundsForPath(element);
    } else if (element.type === 'text') {
      const width = element.text.length * element.fontSize * 0.6;
      const height = element.fontSize * 1.2;
      return {
        minX: element.x,
        maxX: element.x + width,
        minY: element.y - height,
        maxY: element.y
      };
    } else if (element.type === 'function') {
      return {
        minX: -element.xRange,
        maxX: element.xRange,
        minY: -element.yRange,
        maxY: element.yRange
      };
    }
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  };
  
  const drawResizeHandles = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    const bounds = getElementBounds(element);
    const handleSize = 8 / viewport.scale;
    
    const handles = [
      { x: bounds.minX, y: bounds.minY },
      { x: bounds.maxX, y: bounds.minY },
      { x: bounds.maxX, y: bounds.maxY },
      { x: bounds.minX, y: bounds.maxY },
      { x: (bounds.minX + bounds.maxX) / 2, y: bounds.minY },
      { x: (bounds.minX + bounds.maxX) / 2, y: bounds.maxY },
      { x: bounds.minX, y: (bounds.minY + bounds.maxY) / 2 },
      { x: bounds.maxX, y: (bounds.minY + bounds.maxY) / 2 },
    ];
    
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2 / viewport.scale;
    
    handles.forEach(handle => {
      ctx.fillRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize
      );
      ctx.strokeRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize
      );
    });
  };
  
  const getHandleAtPoint = (element: DrawingElement, point: Point): string | null => {
    const bounds = getElementBounds(element);
    const handleSize = 8 / viewport.scale;
    const threshold = handleSize;
    
    const handles = [
      { name: 'tl', x: bounds.minX, y: bounds.minY },
      { name: 'tr', x: bounds.maxX, y: bounds.minY },
      { name: 'br', x: bounds.maxX, y: bounds.maxY },
      { name: 'bl', x: bounds.minX, y: bounds.maxY },
      { name: 't', x: (bounds.minX + bounds.maxX) / 2, y: bounds.minY },
      { name: 'b', x: (bounds.minX + bounds.maxX) / 2, y: bounds.maxY },
      { name: 'l', x: bounds.minX, y: (bounds.minY + bounds.maxY) / 2 },
      { name: 'r', x: bounds.maxX, y: (bounds.minY + bounds.maxY) / 2 },
    ];
    
    for (const handle of handles) {
      const dx = point.x - handle.x;
      const dy = point.y - handle.y;
      if (Math.sqrt(dx * dx + dy * dy) <= threshold) {
        return handle.name;
      }
    }
    
    return null;
  };
  
  const constrainViewport = useCallback((newViewport: ViewportTransform): ViewportTransform => {
    const { x, y, scale } = newViewport;
    const MAX_PAN = 10000;
    
    const constrainedX = Math.min(Math.max(x, -MAX_PAN), MAX_PAN);
    const constrainedY = Math.min(Math.max(y, -MAX_PAN), MAX_PAN);
    const constrainedScale = Math.min(Math.max(scale, 0.2), 2.0); // 20% do 200%
    
    return { 
      x: constrainedX, 
      y: constrainedY, 
      scale: constrainedScale 
    };
  }, []);
  
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    ctx.save();
    ctx.translate(rect.width / 2, rect.height / 2);
    ctx.scale(viewport.scale, viewport.scale);
    ctx.translate(-viewport.x, -viewport.y);
    
    drawInfiniteGrid(ctx, rect.width, rect.height);
    
    const allElements = [...elements, ...(currentElement ? [currentElement] : [])];
    
    allElements.forEach(element => {
      const isSelected = selectedElementIds.has(element.id) || element.id === selectedElementId;
      const isBeingEdited = isEditingText && element.id === pendingTextId;
      
      if (element.type === 'path') {
        drawPath(ctx, element, isSelected);
      } else if (element.type === 'shape') {
        drawShape(ctx, element, isSelected);
      } else if (element.type === 'text') {
        if (!isBeingEdited) {
          drawText(ctx, element, isSelected);
        }
      } else if (element.type === 'function') {
        drawFunctionPlot(ctx, element, isSelected);
      }
    });
    
    allElements.forEach(element => {
      const isSelected = selectedElementIds.has(element.id) || element.id === selectedElementId;
      if (isSelected && (element.type === 'shape' || element.type === 'path')) {
        drawResizeHandles(ctx, element);
      }
    });
    
    if (isSelecting && selectionStart && selectionEnd) {
      ctx.strokeStyle = '#3b82f6';
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1 / viewport.scale;
      ctx.setLineDash([5 / viewport.scale, 5 / viewport.scale]);
      
      const width = selectionEnd.x - selectionStart.x;
      const height = selectionEnd.y - selectionStart.y;
      
      ctx.fillRect(selectionStart.x, selectionStart.y, width, height);
      ctx.strokeRect(selectionStart.x, selectionStart.y, width, height);
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  }, [elements, viewport, currentElement, selectedElementId, selectedElementIds, isSelecting, selectionStart, selectionEnd, isEditingText, pendingTextId]);
  
  useEffect(() => {
    redrawCanvasRef.current = redrawCanvas;
    redrawCanvas();
  }, [redrawCanvas]);
  
  const drawInfiniteGrid = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    const gridSize = 50;
    
    const worldLeft = viewport.x - canvasWidth / (2 * viewport.scale);
    const worldRight = viewport.x + canvasWidth / (2 * viewport.scale);
    const worldTop = viewport.y - canvasHeight / (2 * viewport.scale);
    const worldBottom = viewport.y + canvasHeight / (2 * viewport.scale);
    
    const startX = Math.floor(worldLeft / gridSize) * gridSize;
    const endX = Math.ceil(worldRight / gridSize) * gridSize;
    const startY = Math.floor(worldTop / gridSize) * gridSize;
    const endY = Math.ceil(worldBottom / gridSize) * gridSize;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1 / viewport.scale;
    
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }
    
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
    
    // Osie środka (0, 0) - grubsze
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2 / viewport.scale;
    
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(endX, 0);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, startY);
    ctx.lineTo(0, endY);
    ctx.stroke();
  };
  
  const drawPath = (ctx: CanvasRenderingContext2D, path: DrawingPath, isSelected: boolean) => {
    if (path.points.length < 2) return;
    
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.width / viewport.scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);
    for (let i = 1; i < path.points.length; i++) {
      ctx.lineTo(path.points[i].x, path.points[i].y);
    }
    ctx.stroke();
    
    if (isSelected) drawSelectionBox(ctx, getBoundsForPath(path));
  };
  
  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, isSelected: boolean) => {
    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth / viewport.scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const width = shape.endX - shape.startX;
    const height = shape.endY - shape.startY;
    
    ctx.beginPath();
    
    if (shape.shapeType === 'rectangle') {
      ctx.rect(shape.startX, shape.startY, width, height);
    } else if (shape.shapeType === 'circle') {
      const radius = Math.sqrt(width * width + height * height) / 2;
      const centerX = shape.startX + width / 2;
      const centerY = shape.startY + height / 2;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    } else if (shape.shapeType === 'triangle') {
      ctx.moveTo(shape.startX + width / 2, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.lineTo(shape.startX, shape.endY);
      ctx.closePath();
    } else if (shape.shapeType === 'line') {
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
    } else if (shape.shapeType === 'arrow') {
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
      
      const angle = Math.atan2(shape.endY - shape.startY, shape.endX - shape.startX);
      const headLength = 15 / viewport.scale;
      
      ctx.beginPath();
      ctx.moveTo(shape.endX, shape.endY);
      ctx.lineTo(
        shape.endX - headLength * Math.cos(angle - Math.PI / 6),
        shape.endY - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        shape.endX - headLength * Math.cos(angle + Math.PI / 6),
        shape.endY - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      
      if (isSelected) drawSelectionBox(ctx, {
        minX: Math.min(shape.startX, shape.endX),
        minY: Math.min(shape.startY, shape.endY),
        maxX: Math.max(shape.startX, shape.endX),
        maxY: Math.max(shape.startY, shape.endY)
      });
      return;
    }
    
    if (shape.fill && shape.shapeType !== 'line') {
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.stroke();
    
    if (isSelected) drawSelectionBox(ctx, {
      minX: Math.min(shape.startX, shape.endX),
      minY: Math.min(shape.startY, shape.endY),
      maxX: Math.max(shape.startX, shape.endX),
      maxY: Math.max(shape.startY, shape.endY)
    });
  };
  
  const drawText = (ctx: CanvasRenderingContext2D, text: TextElement, isSelected: boolean) => {
    ctx.fillStyle = text.color;
    ctx.font = `${text.fontSize / viewport.scale}px Arial`;
    ctx.textBaseline = 'top';
    
    const lines = text.text.split('\n');
    const lineHeight = text.fontSize / viewport.scale * 1.2;
    
    lines.forEach((line, i) => {
      ctx.fillText(line, text.x, text.y + i * lineHeight);
    });
    
    if (isSelected) {
      const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
      const width = Math.max(maxLineWidth, 50);
      const height = lineHeight * lines.length;
      
      drawSelectionBox(ctx, {
        minX: text.x,
        minY: text.y,
        maxX: text.x + width,
        maxY: text.y + height
      });
    }
  };
  
  // 🔥 RYSOWANIE FUNKCJI MATEMATYCZNEJ - POPRAWIONE
  const drawFunctionPlot = (ctx: CanvasRenderingContext2D, plot: FunctionPlot, isSelected: boolean) => {
    ctx.save();
    
    const { expression, color, strokeWidth, xRange, yRange } = plot;
    
    // Rysuj funkcję
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth / viewport.scale;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    let started = false;
    const samples = 1000;
    
    // Matematyczny zakres (dla funkcji typu sin, cos)
    const mathXRange = 10;  // Funkcje będą ewaluowane od -10 do +10
    const mathYScale = yRange / mathXRange; // Skalowanie Y dla widoczności
    
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      
      // World X coordinate (gdzie rysujemy)
      const worldX = -xRange + t * (xRange * 2);
      
      // Mathematical X (co przekazujemy do funkcji)
      const mathX = (worldX / xRange) * mathXRange;
      
      try {
        // Ewaluuj funkcję w mathematical space
        const mathY = evaluateExpression(expression, mathX);
        
        if (!isFinite(mathY)) {
          started = false;
          continue;
        }
        
        // Przeskaluj Y do world space
        const worldY = -mathY * mathYScale;  // Odwróć Y i przeskaluj
        
        // Clip jeśli za duże
        if (Math.abs(worldY) > yRange * 3) {
          started = false;
          continue;
        }
        
        if (!started) {
          ctx.moveTo(worldX, worldY);
          started = true;
        } else {
          ctx.lineTo(worldX, worldY);
        }
      } catch (e) {
        started = false;
      }
    }
    
    ctx.stroke();
    
    // Label funkcji
    ctx.fillStyle = color;
    ctx.font = `bold ${14 / viewport.scale}px Arial`;
    ctx.textBaseline = 'top';
    const labelPadding = 10 / viewport.scale;
    ctx.fillText(
      `f(x) = ${expression}`,
      -xRange + labelPadding,
      -yRange + labelPadding
    );
    
    // Selection box
    if (isSelected) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2 / viewport.scale;
      ctx.setLineDash([5 / viewport.scale, 5 / viewport.scale]);
      
      const padding = 5 / viewport.scale;
      ctx.strokeRect(
        -xRange - padding,
        -yRange - padding,
        xRange * 2 + padding * 2,
        yRange * 2 + padding * 2
      );
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  };
  
  const drawSelectionBox = (
    ctx: CanvasRenderingContext2D,
    bounds: { minX: number; minY: number; maxX: number; maxY: number }
  ) => {
    const padding = 5 / viewport.scale;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2 / viewport.scale;
    ctx.setLineDash([5 / viewport.scale, 5 / viewport.scale]);
    ctx.strokeRect(
      bounds.minX - padding,
      bounds.minY - padding,
      bounds.maxX - bounds.minX + padding * 2,
      bounds.maxY - bounds.minY + padding * 2
    );
    ctx.setLineDash([]);
  };
  
  const getBoundsForPath = (path: DrawingPath) => {
    const xs = path.points.map(p => p.x);
    const ys = path.points.map(p => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  };
  
  const getCanvasPoint = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  const isElementInBox = (element: DrawingElement, minX: number, minY: number, maxX: number, maxY: number): boolean => {
    if (element.type === 'text') {
      return element.x >= minX && element.x <= maxX && element.y >= minY && element.y <= maxY;
    } else if (element.type === 'shape') {
      const elMinX = Math.min(element.startX, element.endX);
      const elMaxX = Math.max(element.startX, element.endX);
      const elMinY = Math.min(element.startY, element.endY);
      const elMaxY = Math.max(element.startY, element.endY);
      
      return !(elMaxX < minX || elMinX > maxX || elMaxY < minY || elMinY > maxY);
    } else if (element.type === 'path') {
      const bounds = getBoundsForPath(element);
      return !(bounds.maxX < minX || bounds.minX > maxX || bounds.maxY < minY || bounds.minY > maxY);
    } else if (element.type === 'function') {
      return !(-element.xRange > maxX || element.xRange < minX || -element.yRange > maxY || element.yRange < minY);
    }
    return false;
  };
  
  const findElementAtPoint = (canvasPoint: Point): DrawingElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      const padding = 10;
      
      if (element.type === 'text') {
        const width = 200;
        const height = element.fontSize * 1.2;
        if (
          canvasPoint.x >= element.x - padding &&
          canvasPoint.x <= element.x + width + padding &&
          canvasPoint.y >= element.y - padding &&
          canvasPoint.y <= element.y + height + padding
        ) {
          return element;
        }
      } else if (element.type === 'shape') {
        const minX = Math.min(element.startX, element.endX);
        const maxX = Math.max(element.startX, element.endX);
        const minY = Math.min(element.startY, element.endY);
        const maxY = Math.max(element.startY, element.endY);
        
        if (
          canvasPoint.x >= minX - padding &&
          canvasPoint.x <= maxX + padding &&
          canvasPoint.y >= minY - padding &&
          canvasPoint.y <= maxY + padding
        ) {
          return element;
        }
      } else if (element.type === 'path') {
        const bounds = getBoundsForPath(element);
        if (
          canvasPoint.x >= bounds.minX - padding &&
          canvasPoint.x <= bounds.maxX + padding &&
          canvasPoint.y >= bounds.minY - padding &&
          canvasPoint.y <= bounds.maxY + padding
        ) {
          return element;
        }
      } else if (element.type === 'function') {
        if (
          canvasPoint.x >= -element.xRange - padding &&
          canvasPoint.x <= element.xRange + padding &&
          canvasPoint.y >= -element.yRange - padding &&
          canvasPoint.y <= element.yRange + padding
        ) {
          return element;
        }
      }
    }
    return null;
  };
  
  // 🔥 GENEROWANIE FUNKCJI
  const handleGenerateFunction = useCallback((expression: string) => {
    // Większy zakres dla lepszej widoczności
    // 1 jednostka matematyczna = 50 pikseli (rozmiar kratki na gridzie)
    const xRange = 1000;  // -500 do +500 pikseli (20 kratek w każdą stronę)
    const yRange = 1000;  // -500 do +500 pikseli (20 kratek w każdą stronę)
    
    const newFunction: FunctionPlot = {
      id: Date.now().toString(),
      type: 'function',
      expression,
      color,
      strokeWidth: lineWidth,
      xRange,
      yRange
    };
    
    setElements(prev => [...prev, newFunction]);
    saveToHistory();
    setTool('select'); // Przejdź do trybu zaznaczania
  }, [color, lineWidth]);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isEditingText) {
      finishTextInput();
      return;
    }
    
    const screenPoint = getCanvasPoint(e);
    const canvasPoint = screenToCanvas(screenPoint.x, screenPoint.y);
    
    // Pan mode
    if (tool === 'pan' || e.button === 1 || e.button === 2 || (e.button === 0 && (e.ctrlKey || e.metaKey))) {
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint(screenPoint);
      return;
    }
    
    // Select mode
    if (tool === 'select') {
      const element = findElementAtPoint(canvasPoint);
      
      if (element && (selectedElementIds.has(element.id) || element.id === selectedElementId)) {
        const handle = getHandleAtPoint(element, canvasPoint);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          setDragStartPoint(canvasPoint);
          setSelectedElementId(element.id);
          setResizeStartBounds(getElementBounds(element));
          return;
        }
      }
      
      if (element) {
        if (e.ctrlKey || e.metaKey) {
          setSelectedElementIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(element.id)) {
              newSet.delete(element.id);
            } else {
              newSet.add(element.id);
            }
            return newSet;
          });
        } else if (selectedElementIds.has(element.id)) {
          const elementsToSave = new Map();
          elements.forEach(el => {
            if (selectedElementIds.has(el.id)) {
              elementsToSave.set(el.id, { ...el });
            }
          });
          setIsDraggingElement(true);
          setDragStartPoint(canvasPoint);
          setDraggedElementsStart(elementsToSave);
        } else {
          setSelectedElementIds(new Set([element.id]));
          setSelectedElementId(element.id);
          const elementsToSave = new Map();
          elementsToSave.set(element.id, { ...element });
          setIsDraggingElement(true);
          setDragStartPoint(canvasPoint);
          setDraggedElementsStart(elementsToSave);
        }
      } else {
        if (!e.ctrlKey && !e.metaKey) {
          setSelectedElementIds(new Set());
          setSelectedElementId(null);
        }
        setIsSelecting(true);
        setSelectionStart(canvasPoint);
        setSelectionEnd(canvasPoint);
      }
      return;
    }
    
    // TEXT TOOL
    if (tool === 'text') {
      const element = findElementAtPoint(canvasPoint);
      if (element && element.type === 'text') {
        const screenPos = canvasToScreen(element.x, element.y);
        startTextInput(screenPos, canvasPoint, element);
        return;
      }
      
      setIsDrawing(true);
      const textBox: Shape = {
        id: Date.now().toString(),
        type: 'shape',
        shapeType: 'rectangle',
        startX: canvasPoint.x,
        startY: canvasPoint.y,
        endX: canvasPoint.x,
        endY: canvasPoint.y,
        color: '#3b82f6',
        strokeWidth: 2,
        fill: false
      };
      setCurrentElement(textBox);
      return;
    }
    
    // FUNCTION TOOL - nie rysujemy nic, tylko toolbar obsługuje
    if (tool === 'function') {
      // Funkcja jest generowana z toolbara, więc tutaj nic nie robimy
      return;
    }
    
    // Drawing tools
    setIsDrawing(true);
    
    if (tool === 'pen') {
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        type: 'path',
        points: [canvasPoint],
        color,
        width: lineWidth
      };
      setCurrentElement(newPath);
    } else if (tool === 'shape') {
      const newShape: Shape = {
        id: Date.now().toString(),
        type: 'shape',
        shapeType: selectedShape,
        startX: canvasPoint.x,
        startY: canvasPoint.y,
        endX: canvasPoint.x,
        endY: canvasPoint.y,
        color,
        strokeWidth: lineWidth,
        fill: fillShape
      };
      setCurrentElement(newShape);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const screenPoint = getCanvasPoint(e);
    
    if (isPanning && lastPanPoint) {
      const dx = screenPoint.x - lastPanPoint.x;
      const dy = screenPoint.y - lastPanPoint.y;
      
      const worldDx = -dx / viewport.scale;
      const worldDy = -dy / viewport.scale;
      
      setViewport(prev => {
        const newViewport = {
          ...prev,
          x: prev.x + worldDx,
          y: prev.y + worldDy
        };
        return constrainViewport(newViewport);
      });
      setLastPanPoint(screenPoint);
      return;
    }
    
    const canvasPoint = screenToCanvas(screenPoint.x, screenPoint.y);
    
    if (isResizing && dragStartPoint && resizeHandle && selectedElementId && resizeStartBounds) {
      const dx = canvasPoint.x - dragStartPoint.x;
      const dy = canvasPoint.y - dragStartPoint.y;
      
      setElements(prev => prev.map(el => {
        if (el.id !== selectedElementId) return el;
        
        if (el.type === 'shape') {
          let newStartX = el.startX;
          let newStartY = el.startY;
          let newEndX = el.endX;
          let newEndY = el.endY;
          
          if (resizeHandle.includes('l')) newStartX = resizeStartBounds.minX + dx;
          if (resizeHandle.includes('r')) newEndX = resizeStartBounds.maxX + dx;
          if (resizeHandle.includes('t')) newStartY = resizeStartBounds.minY + dy;
          if (resizeHandle.includes('b')) newEndY = resizeStartBounds.maxY + dy;
          
          if (resizeHandle === 'tl') {
            newStartX = el.startX < el.endX ? resizeStartBounds.minX + dx : el.startX;
            newStartY = el.startY < el.endY ? resizeStartBounds.minY + dy : el.startY;
            if (el.startX > el.endX) newEndX = resizeStartBounds.minX + dx;
            if (el.startY > el.endY) newEndY = resizeStartBounds.minY + dy;
          } else if (resizeHandle === 'tr') {
            newEndX = el.endX > el.startX ? resizeStartBounds.maxX + dx : el.endX;
            newStartY = el.startY < el.endY ? resizeStartBounds.minY + dy : el.startY;
            if (el.endX < el.startX) newStartX = resizeStartBounds.maxX + dx;
            if (el.startY > el.endY) newEndY = resizeStartBounds.minY + dy;
          } else if (resizeHandle === 'br') {
            newEndX = el.endX > el.startX ? resizeStartBounds.maxX + dx : el.endX;
            newEndY = el.endY > el.startY ? resizeStartBounds.maxY + dy : el.endY;
            if (el.endX < el.startX) newStartX = resizeStartBounds.maxX + dx;
            if (el.endY < el.startY) newStartY = resizeStartBounds.maxY + dy;
          } else if (resizeHandle === 'bl') {
            newStartX = el.startX < el.endX ? resizeStartBounds.minX + dx : el.startX;
            newEndY = el.endY > el.startY ? resizeStartBounds.maxY + dy : el.endY;
            if (el.startX > el.endX) newEndX = resizeStartBounds.minX + dx;
            if (el.endY < el.startY) newStartY = resizeStartBounds.maxY + dy;
          } else if (resizeHandle === 't') {
            newStartY = el.startY < el.endY ? resizeStartBounds.minY + dy : el.startY;
            if (el.startY > el.endY) newEndY = resizeStartBounds.minY + dy;
          } else if (resizeHandle === 'b') {
            newEndY = el.endY > el.startY ? resizeStartBounds.maxY + dy : el.endY;
            if (el.endY < el.startY) newStartY = resizeStartBounds.maxY + dy;
          } else if (resizeHandle === 'l') {
            newStartX = el.startX < el.endX ? resizeStartBounds.minX + dx : el.startX;
            if (el.startX > el.endX) newEndX = resizeStartBounds.minX + dx;
          } else if (resizeHandle === 'r') {
            newEndX = el.endX > el.startX ? resizeStartBounds.maxX + dx : el.endX;
            if (el.endX < el.startX) newStartX = resizeStartBounds.maxX + dx;
          }
          
          return {
            ...el,
            startX: newStartX,
            startY: newStartY,
            endX: newEndX,
            endY: newEndY
          };
        } else if (el.type === 'path') {
          const scaleX = (resizeStartBounds.maxX - resizeStartBounds.minX + dx * (resizeHandle.includes('r') ? 1 : resizeHandle.includes('l') ? -1 : 0)) / (resizeStartBounds.maxX - resizeStartBounds.minX);
          const scaleY = (resizeStartBounds.maxY - resizeStartBounds.minY + dy * (resizeHandle.includes('b') ? 1 : resizeHandle.includes('t') ? -1 : 0)) / (resizeStartBounds.maxY - resizeStartBounds.minY);
          
          return {
            ...el,
            points: el.points.map(p => ({
              x: resizeStartBounds.minX + (p.x - resizeStartBounds.minX) * scaleX,
              y: resizeStartBounds.minY + (p.y - resizeStartBounds.minY) * scaleY
            }))
          };
        }
        
        return el;
      }));
      return;
    }
    
    if (isSelecting && selectionStart) {
      setSelectionEnd(canvasPoint);
      return;
    }
    
    if (isDraggingElement && dragStartPoint && draggedElementsStart.size > 0) {
      const dx = canvasPoint.x - dragStartPoint.x;
      const dy = canvasPoint.y - dragStartPoint.y;
      
      setElements(prev => prev.map(el => {
        const startEl = draggedElementsStart.get(el.id);
        if (!startEl) return el;
        
        if (el.type === 'text') {
          const textStartEl = startEl as TextElement;
          return { ...el, x: textStartEl.x + dx, y: textStartEl.y + dy };
        } else if (el.type === 'shape') {
          const shapeStartEl = startEl as Shape;
          return {
            ...el,
            startX: shapeStartEl.startX + dx,
            startY: shapeStartEl.startY + dy,
            endX: shapeStartEl.endX + dx,
            endY: shapeStartEl.endY + dy
          };
        } else if (el.type === 'path') {
          const pathStartEl = startEl as DrawingPath;
          return {
            ...el,
            points: pathStartEl.points.map((p: Point) => ({ 
              x: p.x + dx, 
              y: p.y + dy 
            }))
          };
        }
        return el;
      }));
      return;
    }
    
    if (!isDrawing || !currentElement) return;
    
    if (currentElement.type === 'path') {
      setCurrentElement(prev => ({
        ...prev!,
        points: [...(prev as DrawingPath).points, canvasPoint]
      } as DrawingPath));
    } else if (currentElement.type === 'shape') {
      setCurrentElement(prev => ({
        ...prev!,
        endX: canvasPoint.x,
        endY: canvasPoint.y
      }));
    }
  };
  
  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
      setLastPanPoint(null);
      return;
    }
    
    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      setDragStartPoint(null);
      setResizeStartBounds(null);
      saveToHistory();
      return;
    }
    
    if (isSelecting && selectionStart && selectionEnd) {
      const minX = Math.min(selectionStart.x, selectionEnd.x);
      const maxX = Math.max(selectionStart.x, selectionEnd.x);
      const minY = Math.min(selectionStart.y, selectionEnd.y);
      const maxY = Math.max(selectionStart.y, selectionEnd.y);
      
      const selectedIds = new Set<string>();
      elements.forEach(element => {
        if (isElementInBox(element, minX, minY, maxX, maxY)) {
          selectedIds.add(element.id);
        }
      });
      
      setSelectedElementIds(selectedIds);
      setSelectedElementId(selectedIds.size === 1 ? Array.from(selectedIds)[0] : null);
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }
    
    if (isDraggingElement) {
      setIsDraggingElement(false);
      setDragStartPoint(null);
      setDraggedElementsStart(new Map());
      saveToHistory();
      return;
    }
    
    if (isDrawing && currentElement) {
      if (tool === 'text' && currentElement.type === 'shape') {
        const minX = Math.min(currentElement.startX, currentElement.endX);
        const maxX = Math.max(currentElement.startX, currentElement.endX);
        const minY = Math.min(currentElement.startY, currentElement.endY);
        const maxY = Math.max(currentElement.startY, currentElement.endY);
        
        const width = maxX - minX;
        const height = maxY - minY;
        
        const finalWidth = width < 50 ? 150 : width;
        const finalHeight = height < 30 ? 40 : height;
        const finalMinX = width < 50 ? currentElement.startX : minX;
        const finalMinY = height < 30 ? currentElement.startY : minY;
        
        const screenHeight = finalHeight * viewport.scale;
        const newFontSize = Math.max(12, Math.min(screenHeight * 0.6, 500));
        setFontSize(newFontSize);
        
        const topLeft = canvasToScreen(finalMinX, finalMinY);
        
        const id = Date.now().toString();
        const newText: TextElement = {
          id,
          type: 'text',
          x: finalMinX,
          y: finalMinY,
          text: '',
          fontSize: newFontSize,
          color
        };
        setElements(prev => [...prev, newText]);
        
        setPendingTextId(id);
        setTextDraft('');
        setTextPosition({ 
          x: topLeft.x, 
          y: topLeft.y
        });
        setTextBoxSize({
          width: finalWidth * viewport.scale,
          height: finalHeight * viewport.scale
        });
        setIsEditingText(true);
        setCurrentElement(null);
        
        setTimeout(() => {
          textInputRef.current?.focus();
        }, 0);
      } else {
        setElements(prev => [...prev, currentElement]);
        setCurrentElement(null);
        saveToHistory();
      }
    }
    
    setIsDrawing(false);
  };
  
  const startTextInput = (screenPoint: Point, canvasPoint: Point, existingText?: TextElement) => {
    if (existingText) {
      setPendingTextId(existingText.id);
      setTextDraft(existingText.text);
      setFontSize(existingText.fontSize);
      setColor(existingText.color);
      
      const screenPos = canvasToScreen(existingText.x, existingText.y);
      setTextPosition(screenPos);
      
      const estimatedWidth = Math.max(150, existingText.text.length * existingText.fontSize * 0.6);
      const estimatedHeight = existingText.fontSize * 1.5;
      setTextBoxSize({
        width: estimatedWidth,
        height: estimatedHeight
      });
    } else {
      const id = Date.now().toString();
      setPendingTextId(id);
      setTextDraft('');
      setTextPosition(screenPoint);
      
      setTextBoxSize({
        width: 150,
        height: 40
      });
      
      const newText: TextElement = {
        id,
        type: 'text',
        x: canvasPoint.x,
        y: canvasPoint.y,
        text: '',
        fontSize,
        color
      };
      setElements(prev => [...prev, newText]);
    }
    
    setIsEditingText(true);
    
    setTimeout(() => {
      textInputRef.current?.focus();
      textInputRef.current?.select();
    }, 0);
  };
  
  const finishTextInput = () => {
    if (!pendingTextId) return;
    
    const trimmedText = textDraft.trim();
    
    if (!trimmedText) {
      setElements(prev => prev.filter(el => el.id !== pendingTextId));
      cancelTextInput();
      return;
    }
    
    setElements(prev => prev.map(el => 
      el.id === pendingTextId && el.type === 'text'
        ? { ...el, text: trimmedText, fontSize, color } as TextElement
        : el
    ));
    
    saveToHistory();
    cancelTextInput();
  };
  
  const cancelTextInput = () => {
    setIsEditingText(false);
    setTextPosition(null);
    setTextBoxSize(null);
    setTextDraft('');
    setPendingTextId(null);
  };
  
  const deleteSelectedElement = () => {
    if (selectedElementIds.size === 0 && !selectedElementId) return;
    
    setElements(prev => prev.filter(el => 
      !selectedElementIds.has(el.id) && el.id !== selectedElementId
    ));
    setSelectedElementIds(new Set());
    setSelectedElementId(null);
    saveToHistory();
  };
  
  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  }, [historyIndex, history]);
  
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  }, [historyIndex, history.length]);
  
  const clearCanvas = useCallback(() => {
    if (confirm('Czy na pewno chcesz wyczyścić całą tablicę?')) {
      setElements([]);
      setSelectedElementId(null);
      setSelectedElementIds(new Set());
      saveToHistory();
    }
  }, []);
  
  const resetView = useCallback(() => {
    setViewport({ x: 0, y: 0, scale: 1 });
  }, []);
  
  const zoomIn = useCallback(() => {
    setViewport(prev => constrainViewport({ 
      ...prev, 
      scale: prev.scale * 1.2 
    }));
  }, []);
  
  const zoomOut = useCallback(() => {
    setViewport(prev => constrainViewport({ 
      ...prev, 
      scale: prev.scale / 1.2 
    }));
  }, []);
  
  return (
    <div className={`relative w-full h-full bg-white ${className}`}>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
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
          onResetView={resetView}
          onGenerateFunction={handleGenerateFunction}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          splitSize={splitSize}
          onToggleView={onToggleView}
        />
        
        <ZoomControls
          zoom={viewport.scale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetView={resetView}
        />
        
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 w-full h-full touch-none"
          style={{
            cursor: 
              tool === 'pan' || isPanning ? 'grab' : 
              tool === 'select' ? 'default' : 
              tool === 'text' ? 'text' :
              'crosshair',
            willChange: 'auto',
            imageRendering: 'crisp-edges'
          }}
        />
        
        {isEditingText && textPosition && textBoxSize && (
          <textarea
            ref={textInputRef}
            value={textDraft}
            onChange={(e) => setTextDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                finishTextInput();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                finishTextInput();
              }
            }}
            onBlur={finishTextInput}
            placeholder=""
            className="absolute z-50 px-2 py-1 outline-none border-2 border-blue-500 bg-white/90 resize-none overflow-hidden"
            style={{
              left: `${textPosition.x}px`,
              top: `${textPosition.y}px`,
              width: `${textBoxSize.width}px`,
              height: `${textBoxSize.height}px`,
              fontSize: `${fontSize}px`,
              color: color,
              lineHeight: '1.2',
              fontFamily: 'Arial, sans-serif',
              whiteSpace: 'pre-wrap',
              boxSizing: 'border-box'
            }}
            autoFocus
          />
        )}
      </div>
    </div>
  );
}
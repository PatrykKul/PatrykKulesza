'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PenTool, Eraser, Trash2, Type, X, Shapes, Download, Undo, Redo, Copy, Grid, Layers, Palette } from 'lucide-react';

type Tool = 'pen' | 'eraser' | 'text' | 'shape' | 'select';
type ShapeType = 'circle' | 'rectangle' | 'triangle' | 'line' | 'arrow' | 'axes';

interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  endX?: number;
  endY?: number;
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
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}

interface HistoryState {
  shapes: Shape[];
  textElements: TextElement[];
  drawing: string;
}

export default function AdvancedCanvas({ problemId }: { problemId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Core state
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [selectedShape, setSelectedShape] = useState<ShapeType>('circle');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  
  // Advanced features
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  
  // Elements
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  
  // Text styling
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  
  // Selection & clipboard
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<{ shapes: Shape[], texts: TextElement[] } | null>(null);
  
  // Undo/Redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isRestoringHistory, setIsRestoringHistory] = useState(false);

  // Grid drawing
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = 10;
    ctx.strokeStyle = snapToGrid ? '#d1d5db' : '#e5e7eb';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [snapToGrid]);

  // Shape drawing
  const drawShapes = useCallback((ctx: CanvasRenderingContext2D) => {
    shapes.forEach(shape => {
      const isSelected = selectedElements.includes(shape.id);
      
      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.color + '20';
      ctx.lineWidth = shape.strokeWidth;

      if (isSelected) {
        ctx.strokeStyle = '#58a6ff';
        ctx.lineWidth = shape.strokeWidth + 2;
      }

      switch (shape.type) {
        case 'circle':
          if (shape.radius) {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
          }
          break;

        case 'rectangle':
          if (shape.width && shape.height) {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
          }
          break;

        case 'triangle':
          if (shape.width && shape.height) {
            ctx.beginPath();
            ctx.moveTo(shape.x + shape.width / 2, shape.y);
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
            ctx.lineTo(shape.x, shape.y + shape.height);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
          }
          break;

        case 'line':
          if (shape.endX !== undefined && shape.endY !== undefined) {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
          }
          break;

        case 'arrow':
          if (shape.endX !== undefined && shape.endY !== undefined) {
            const headlen = 15;
            const dx = shape.endX - shape.x;
            const dy = shape.endY - shape.y;
            const angle = Math.atan2(dy, dx);
            
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.lineTo(
              shape.endX - headlen * Math.cos(angle - Math.PI / 6),
              shape.endY - headlen * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(shape.endX, shape.endY);
            ctx.lineTo(
              shape.endX - headlen * Math.cos(angle + Math.PI / 6),
              shape.endY - headlen * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
          }
          break;

        case 'axes':
          const centerX = shape.x;
          const centerY = shape.y;
          const axisLength = 100;
          
          ctx.beginPath();
          ctx.moveTo(centerX - axisLength, centerY);
          ctx.lineTo(centerX + axisLength, centerY);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(centerX + axisLength, centerY);
          ctx.lineTo(centerX + axisLength - 10, centerY - 5);
          ctx.moveTo(centerX + axisLength, centerY);
          ctx.lineTo(centerX + axisLength - 10, centerY + 5);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - axisLength);
          ctx.lineTo(centerX, centerY + axisLength);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - axisLength);
          ctx.lineTo(centerX - 5, centerY - axisLength + 10);
          ctx.moveTo(centerX, centerY - axisLength);
          ctx.lineTo(centerX + 5, centerY - axisLength + 10);
          ctx.stroke();
          break;
      }
    });
  }, [shapes, selectedElements]);

  // Snap to grid helper
  const snapPosition = (pos: number) => {
    if (!snapToGrid) return pos;
    return Math.round(pos / 10) * 10;
  };

  // Save to history
  const saveToHistory = useCallback(() => {
    if (isRestoringHistory) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newState: HistoryState = {
      shapes: JSON.parse(JSON.stringify(shapes)),
      textElements: JSON.parse(JSON.stringify(textElements)),
      drawing: canvas.toDataURL()
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  }, [shapes, textElements, history, historyIndex, isRestoringHistory]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    
    setIsRestoringHistory(true);
    const prevState = history[historyIndex - 1];
    
    setShapes(prevState.shapes);
    setTextElements(prevState.textElements);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && prevState.drawing) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas);
        ctx.drawImage(img, 0, 0);
        setIsRestoringHistory(false);
      };
      img.src = prevState.drawing;
    }
    
    setHistoryIndex(historyIndex - 1);
  }, [history, historyIndex, drawGrid]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    
    setIsRestoringHistory(true);
    const nextState = history[historyIndex + 1];
    
    setShapes(nextState.shapes);
    setTextElements(nextState.textElements);
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx && nextState.drawing) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas);
        ctx.drawImage(img, 0, 0);
        setIsRestoringHistory(false);
      };
      img.src = nextState.drawing;
    }
    
    setHistoryIndex(historyIndex + 1);
  }, [history, historyIndex, drawGrid]);

  // Copy
  const copySelected = useCallback(() => {
    const selectedShapes = shapes.filter(s => selectedElements.includes(s.id));
    const selectedTexts = textElements.filter(t => selectedElements.includes(t.id));
    
    if (selectedShapes.length > 0 || selectedTexts.length > 0) {
      setClipboard({ shapes: selectedShapes, texts: selectedTexts });
    }
  }, [shapes, textElements, selectedElements]);

  // Paste
  const paste = useCallback(() => {
    if (!clipboard) return;
    
    const newShapes = clipboard.shapes.map(s => ({
      ...s,
      id: `shape-${Date.now()}-${Math.random()}`,
      x: s.x + 20,
      y: s.y + 20
    }));
    
    const newTexts = clipboard.texts.map(t => ({
      ...t,
      id: `text-${Date.now()}-${Math.random()}`,
      x: t.x + 20,
      y: t.y + 20
    }));
    
    setShapes([...shapes, ...newShapes]);
    setTextElements([...textElements, ...newTexts]);
    saveToHistory();
  }, [clipboard, shapes, textElements, saveToHistory]);

  // Delete selected
  const deleteSelected = useCallback(() => {
    setShapes(shapes.filter(s => !selectedElements.includes(s.id)));
    setTextElements(textElements.filter(t => !selectedElements.includes(t.id)));
    setSelectedElements([]);
    saveToHistory();
  }, [shapes, textElements, selectedElements, saveToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingTextId) return; // Don't trigger shortcuts when editing text
      
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      
      // Ctrl/Cmd + Shift + Z = Redo (or Ctrl/Cmd + Y)
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      
      // Ctrl/Cmd + C = Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        copySelected();
      }
      
      // Ctrl/Cmd + V = Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        paste();
      }
      
      // Delete/Backspace = Delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElements.length > 0) {
        e.preventDefault();
        deleteSelected();
      }
      
      // G = Toggle grid snap
      if (e.key === 'g') {
        setSnapToGrid(!snapToGrid);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copySelected, paste, deleteSelected, selectedElements, editingTextId, snapToGrid]);

  // Templates
  const applyTemplate = (templateName: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    let newShapes: Shape[] = [];
    
    switch (templateName) {
      case 'coordinate-system':
        newShapes = [{
          id: `shape-${Date.now()}`,
          type: 'axes',
          x: centerX,
          y: centerY,
          color: '#000000',
          strokeWidth: 2
        }];
        break;
        
      case 'circle-grid':
        for (let i = 1; i <= 3; i++) {
          newShapes.push({
            id: `shape-${Date.now()}-${i}`,
            type: 'circle',
            x: centerX,
            y: centerY,
            radius: i * 50,
            color: '#2563eb',
            strokeWidth: 1
          });
        }
        break;
        
      case 'triangle-template':
        newShapes = [{
          id: `shape-${Date.now()}`,
          type: 'triangle',
          x: centerX - 100,
          y: centerY - 50,
          width: 200,
          height: 150,
          color: '#dc2626',
          strokeWidth: 2
        }];
        break;
    }
    
    setShapes([...shapes, ...newShapes]);
    setShowTemplateMenu(false);
    saveToHistory();
  };

  // Export canvas
  const exportCanvas = (format: 'png' | 'svg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `rozwiazanie-${problemId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      // SVG export would require converting canvas to SVG
      // For now, just export as PNG
      exportCanvas('png');
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = 500;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const savedData = localStorage.getItem(`canvas-data-${problemId}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.textElements) setTextElements(parsedData.textElements);
        if (parsedData.shapes) setShapes(parsedData.shapes);
        if (parsedData.drawing) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0);
          img.src = parsedData.drawing;
        } else {
          drawGrid(ctx, canvas);
        }
      } else {
        drawGrid(ctx, canvas);
      }
    } catch (error) {
      console.error('Failed to load canvas data:', error);
      drawGrid(ctx, canvas);
    }
  }, [problemId, drawGrid]);

  // Redraw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGrid(ctx, canvas);
    drawShapes(ctx);
    
    if (currentShape) {
      ctx.save();
      ctx.strokeStyle = currentShape.color;
      ctx.fillStyle = currentShape.color + '20';
      ctx.lineWidth = currentShape.strokeWidth;
      ctx.setLineDash([5, 5]);

      switch (currentShape.type) {
        case 'circle':
          if (currentShape.radius) {
            ctx.beginPath();
            ctx.arc(currentShape.x, currentShape.y, currentShape.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
          }
          break;
        case 'rectangle':
          if (currentShape.width && currentShape.height) {
            ctx.strokeRect(currentShape.x, currentShape.y, currentShape.width, currentShape.height);
            ctx.fillRect(currentShape.x, currentShape.y, currentShape.width, currentShape.height);
          }
          break;
        case 'triangle':
          if (currentShape.width && currentShape.height) {
            ctx.beginPath();
            ctx.moveTo(currentShape.x + currentShape.width / 2, currentShape.y);
            ctx.lineTo(currentShape.x + currentShape.width, currentShape.y + currentShape.height);
            ctx.lineTo(currentShape.x, currentShape.y + currentShape.height);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
          }
          break;
        case 'line':
        case 'arrow':
          if (currentShape.endX !== undefined && currentShape.endY !== undefined) {
            ctx.beginPath();
            ctx.moveTo(currentShape.x, currentShape.y);
            ctx.lineTo(currentShape.endX, currentShape.endY);
            ctx.stroke();
          }
          break;
      }
      
      ctx.restore();
    }
  }, [shapes, currentShape, drawShapes, drawGrid]);

  // Save to localStorage (debounced)
  useEffect(() => {
    if (isRestoringHistory) return;
    
    const timeoutId = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const dataURL = canvas.toDataURL();
        const canvasData = {
          drawing: dataURL,
          textElements,
          shapes
        };
        localStorage.setItem(`canvas-data-${problemId}`, JSON.stringify(canvasData));
      } catch (error) {
        console.error('Failed to save canvas:', error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [textElements, shapes, problemId, isRestoringHistory]);

  // Drawing handlers
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'text') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      
      if (snapToGrid) {
        x = snapPosition(x);
        y = snapPosition(y);
      }

      const newTextElement: TextElement = {
        id: `text-${Date.now()}`,
        x,
        y,
        text: '',
        fontSize,
        color,
        fontWeight,
        fontStyle
      };

      setTextElements(prev => [...prev, newTextElement]);
      setEditingTextId(newTextElement.id);
      saveToHistory();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'text') {
      handleCanvasClick(e);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    if (snapToGrid) {
      x = snapPosition(x);
      y = snapPosition(y);
    }

    if (tool === 'shape') {
      const newShape: Shape = {
        id: `shape-${Date.now()}`,
        type: selectedShape,
        x,
        y,
        color,
        strokeWidth: lineWidth
      };

      if (selectedShape === 'axes') {
        setShapes(prev => [...prev, newShape]);
        saveToHistory();
      } else {
        setCurrentShape(newShape);
        setIsDrawing(true);
      }
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    if (snapToGrid) {
      x = snapPosition(x);
      y = snapPosition(y);
    }

    if (tool === 'shape' && currentShape) {
      const updatedShape = { ...currentShape };
      
      switch (selectedShape) {
        case 'circle':
          const radius = Math.sqrt(Math.pow(x - currentShape.x, 2) + Math.pow(y - currentShape.y, 2));
          updatedShape.radius = radius;
          break;
        case 'rectangle':
        case 'triangle':
          updatedShape.width = x - currentShape.x;
          updatedShape.height = y - currentShape.y;
          break;
        case 'line':
        case 'arrow':
          updatedShape.endX = x;
          updatedShape.endY = y;
          break;
      }
      
      setCurrentShape(updatedShape);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    if (tool === 'shape' && currentShape) {
      setShapes(prev => [...prev, currentShape]);
      setCurrentShape(null);
      saveToHistory();
    }
    
    setIsDrawing(false);
    if (tool !== 'shape') {
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    if (!confirm('Czy na pewno chcesz wyczyścić całe canvas?')) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGrid(ctx, canvas);
    setTextElements([]);
    setShapes([]);
    setSelectedElements([]);
    
    try {
      localStorage.removeItem(`canvas-data-${problemId}`);
    } catch (error) {
      console.error('Failed to clear canvas data:', error);
    }
    
    saveToHistory();
  };

  const colors = [
    { name: 'Czarny', value: '#000000' },
    { name: 'Niebieski', value: '#2563eb' },
    { name: 'Czerwony', value: '#dc2626' },
    { name: 'Zielony', value: '#16a34a' },
    { name: 'Fioletowy', value: '#7c3aed' },
    { name: 'Pomarańczowy', value: '#ea580c' },
  ];

  const lineWidths = [
    { name: 'Cienka', value: 2 },
    { name: 'Średnia', value: 4 },
    { name: 'Gruba', value: 6 },
    { name: 'Bardzo gruba', value: 8 },
  ];

  const fontSizes = [
    { name: 'Mały', value: 12 },
    { name: 'Średni', value: 16 },
    { name: 'Duży', value: 20 },
    { name: 'Bardzo duży', value: 24 },
  ];

  const shapeOptions = [
    { type: 'circle' as const, name: 'Koło', icon: '⭕' },
    { type: 'rectangle' as const, name: 'Prostokąt', icon: '▭' },
    { type: 'triangle' as const, name: 'Trójkąt', icon: '△' },
    { type: 'line' as const, name: 'Linia', icon: '/' },
    { type: 'arrow' as const, name: 'Strzałka', icon: '→' },
    { type: 'axes' as const, name: 'Układ współrzędnych', icon: '⊥' },
  ];

  const templates = [
    { id: 'coordinate-system', name: 'Układ współrzędnych', icon: '📐' },
    { id: 'circle-grid', name: 'Siatka okręgów', icon: '⭕' },
    { id: 'triangle-template', name: 'Szablon trójkąta', icon: '△' },
  ];

  return (
    <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-4 mt-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-[#30363d]">
        {/* Main tools */}
        <div className="flex gap-2">
          <button
            onClick={() => { setTool('pen'); setShowShapeMenu(false); setShowTextMenu(false); }}
            className={`p-2 rounded-lg transition-all ${tool === 'pen' ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
            title="Ołówek"
          >
            <PenTool className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => { setTool('eraser'); setShowShapeMenu(false); setShowTextMenu(false); }}
            className={`p-2 rounded-lg transition-all ${tool === 'eraser' ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
            title="Gumka"
          >
            <Eraser className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => { setTool('text'); setShowTextMenu(!showTextMenu); setShowShapeMenu(false); }}
              className={`p-2 rounded-lg transition-all ${tool === 'text' ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
              title="Tekst"
            >
              <Type className="w-5 h-5" />
            </button>
            
            {showTextMenu && (
              <div className="absolute top-full left-0 mt-2 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 p-3 min-w-[200px]">
                <div className="mb-3">
                  <label className="text-xs text-gray-400 mb-1 block">Rozmiar</label>
                  {fontSizes.map(fs => (
                    <button
                      key={fs.value}
                      onClick={() => setFontSize(fs.value)}
                      className={`w-full text-left px-3 py-1.5 rounded-md hover:bg-[#30363d] transition-colors text-sm ${fontSize === fs.value ? 'bg-[#58a6ff]/20' : ''}`}
                    >
                      {fs.name} ({fs.value}px)
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
                    className={`px-3 py-1.5 rounded-md text-sm font-bold ${fontWeight === 'bold' ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] hover:bg-[#40464d]'}`}
                  >
                    B
                  </button>
                  <button
                    onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
                    className={`px-3 py-1.5 rounded-md text-sm italic ${fontStyle === 'italic' ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] hover:bg-[#40464d]'}`}
                  >
                    I
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => { setTool('shape'); setShowShapeMenu(!showShapeMenu); setShowTextMenu(false); }}
              className={`p-2 rounded-lg transition-all ${tool === 'shape' ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
              title="Kształty"
            >
              <Shapes className="w-5 h-5" />
            </button>
            
            {showShapeMenu && (
              <div className="absolute top-full left-0 mt-2 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 p-2 min-w-[220px]">
                {shapeOptions.map(shape => (
                  <button
                    key={shape.type}
                    onClick={() => { setSelectedShape(shape.type); setTool('shape'); setShowShapeMenu(false); }}
                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-[#30363d] transition-colors flex items-center gap-3 ${selectedShape === shape.type ? 'bg-[#58a6ff]/20' : ''}`}
                  >
                    <span className="text-xl">{shape.icon}</span>
                    <span className="text-sm">{shape.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-2 pl-3 border-l border-[#30363d]">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg bg-[#30363d] text-white hover:bg-[#40464d] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Cofnij (Ctrl+Z)"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg bg-[#30363d] text-white hover:bg-[#40464d] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Ponów (Ctrl+Shift+Z)"
          >
            <Redo className="w-5 h-5" />
          </button>
        </div>

        {/* Copy/Delete */}
        {selectedElements.length > 0 && (
          <div className="flex gap-2 pl-3 border-l border-[#30363d]">
            <button
              onClick={copySelected}
              className="p-2 rounded-lg bg-[#30363d] text-white hover:bg-[#40464d] transition-all"
              title="Kopiuj (Ctrl+C)"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={deleteSelected}
              className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all border border-red-500/30"
              title="Usuń (Delete)"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Colors */}
        {tool !== 'eraser' && (
          <div className="flex gap-2 pl-3 border-l border-[#30363d]">
            {colors.map(c => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-8 h-8 rounded-lg transition-all ${color === c.value ? 'ring-2 ring-[#58a6ff] ring-offset-2 ring-offset-[#21262d]' : ''}`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 hover:opacity-80 transition-all"
              title="Wybierz kolor"
            >
              <Palette className="w-4 h-4 text-white mx-auto" />
            </button>
          </div>
        )}

        {/* Line width */}
        {(tool === 'pen' || tool === 'shape') && (
          <div className="flex gap-2 pl-3 border-l border-[#30363d]">
            {lineWidths.map(lw => (
              <button
                key={lw.value}
                onClick={() => setLineWidth(lw.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${lineWidth === lw.value ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
              >
                {lw.name}
              </button>
            ))}
          </div>
        )}

        {/* Templates & Grid */}
        <div className="flex gap-2 pl-3 border-l border-[#30363d] ml-auto">
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-2 rounded-lg transition-all ${snapToGrid ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
            title={`Przyciąganie do siatki (G) - ${snapToGrid ? 'włączone' : 'wyłączone'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowTemplateMenu(!showTemplateMenu)}
              className="px-3 py-2 rounded-lg bg-[#30363d] text-white hover:bg-[#40464d] transition-all text-sm"
            >
              Szablony
            </button>
            {showTemplateMenu && (
              <div className="absolute top-full right-0 mt-2 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 p-2 min-w-[200px]">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t.id)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-[#30363d] transition-colors flex items-center gap-3"
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-sm">{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={() => exportCanvas('png')}
            className="px-3 py-2 rounded-lg bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-all border border-green-500/30 text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button
            onClick={clearCanvas}
            className="p-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all border border-red-500/30"
            title="Wyczyść wszystko"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="w-full relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className={`w-full border-2 border-[#30363d] rounded-lg shadow-lg bg-white ${
            tool === 'text' ? 'cursor-text' : 'cursor-crosshair'
          }`}
          style={{ touchAction: 'none' }}
        />
        
        {/* Text elements overlay */}
        {textElements.map(textEl => {
          const isSelected = selectedElements.includes(textEl.id);
          return (
            <div
              key={textEl.id}
              className={`absolute group ${isSelected ? 'ring-2 ring-[#58a6ff]' : ''}`}
              style={{
                left: textEl.x,
                top: textEl.y,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto'
              }}
              onClick={() => {
                if (tool === 'select') {
                  setSelectedElements([textEl.id]);
                }
              }}
            >
              {editingTextId === textEl.id ? (
                <input
                  type="text"
                  value={textEl.text}
                  onChange={(e) => {
                    setTextElements(prev => prev.map(el => 
                      el.id === textEl.id ? { ...el, text: e.target.value } : el
                    ));
                  }}
                  onBlur={() => setEditingTextId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditingTextId(null);
                    } else if (e.key === 'Escape') {
                      if (textEl.text === '') {
                        setTextElements(prev => prev.filter(el => el.id !== textEl.id));
                      }
                      setEditingTextId(null);
                    }
                  }}
                  autoFocus
                  className="bg-white border border-gray-300 px-2 py-1 rounded text-black outline-none focus:border-blue-500"
                  style={{
                    fontSize: `${textEl.fontSize}px`,
                    color: textEl.color,
                    fontWeight: textEl.fontWeight,
                    fontStyle: textEl.fontStyle,
                    minWidth: '100px'
                  }}
                  placeholder="Wpisz tekst..."
                />
              ) : (
                <div
                  className="relative cursor-pointer bg-white/90 px-2 py-1 rounded border border-transparent hover:border-gray-300 hover:bg-white transition-colors"
                  onClick={() => setEditingTextId(textEl.id)}
                  style={{
                    fontSize: `${textEl.fontSize}px`,
                    color: textEl.color,
                    fontWeight: textEl.fontWeight,
                    fontStyle: textEl.fontStyle,
                    minWidth: textEl.text ? 'auto' : '100px',
                    minHeight: '24px'
                  }}
                >
                  {textEl.text || 'Kliknij aby edytować'}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTextElements(prev => prev.filter(el => el.id !== textEl.id));
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs hover:bg-red-600"
                    title="Usuń tekst"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Hints */}
        {tool === 'text' && textElements.length === 0 && (
          <div className="absolute top-4 left-4 bg-blue-900/80 text-blue-200 px-3 py-2 rounded-lg text-sm pointer-events-none">
            Kliknij w dowolnym miejscu, aby dodać tekst
          </div>
        )}
        
        {tool === 'shape' && shapes.length === 0 && !currentShape && (
          <div className="absolute top-4 left-4 bg-purple-900/80 text-purple-200 px-3 py-2 rounded-lg text-sm pointer-events-none">
            Kliknij i przeciągnij, aby narysować {shapeOptions.find(s => s.type === selectedShape)?.name.toLowerCase()}
          </div>
        )}
        
        {snapToGrid && (
          <div className="absolute bottom-4 left-4 bg-green-900/80 text-green-200 px-3 py-2 rounded-lg text-sm pointer-events-none">
            ✓ Przyciąganie do siatki aktywne (G aby wyłączyć)
          </div>
        )}
      </div>

      {/* Keyboard shortcuts info */}
      <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-4">
        <span>Ctrl+Z: Cofnij</span>
        <span>Ctrl+Shift+Z: Ponów</span>
        <span>Ctrl+C: Kopiuj</span>
        <span>Ctrl+V: Wklej</span>
        <span>Delete: Usuń zaznaczone</span>
        <span>G: Przełącz siatkę</span>
      </div>
    </div>
  );
}
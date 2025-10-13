import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PenTool, Eraser, Trash2, Type, X, Shapes, Download, Undo, Redo, Copy, Grid, Layers, Palette, PlusSquare } from 'lucide-react';

type Tool = 'pen' | 'eraser' | 'text' | 'shape' | 'select' | 'template';
type ShapeType = 'circle' | 'rectangle' | 'triangle' | 'line' | 'arrow' | 'axes';
type TemplateType = 'coordinate-system' | 'circle-grid' | 'triangle-template';

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
  width: number;
  height: number;
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
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('coordinate-system');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [canvasHeight, setCanvasHeight] = useState(600);
  
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
  const [currentTemplate, setCurrentTemplate] = useState<{x: number; y: number; width: number; height: number; type: TemplateType} | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [currentTextBox, setCurrentTextBox] = useState<Omit<TextElement, 'id' | 'text'> | null>(null);
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
  const [historyIndex, setHistoryIndex] = useState(-1); // -1 oznacza pusty canvas, 0+ to zapisane stany
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
          const axisLength = shape.width ? shape.width / 2 : 100;
          
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

  // Get correct mouse position - fixes responsiveness issues
  const getMousePosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;
    
    if (snapToGrid) {
      x = snapPosition(x);
      y = snapPosition(y);
    }

    return { x, y };
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

    // Obetnij historię od aktualnego indeksu i dodaj nowy stan
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
      setHistoryIndex(48); // 49 - 1
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
  }, [shapes, textElements, history, historyIndex, isRestoringHistory]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex < 0 || history.length === 0) return;
    
    setIsRestoringHistory(true);
    
    // Jeśli jesteśmy na indeksie 0, to znaczy że cofamy się do stanu początkowego
    if (historyIndex === 0) {
      // Przywróć pusty canvas
      setShapes([]);
      setTextElements([]);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas);
        setIsRestoringHistory(false);
      }
      setHistoryIndex(-1); // -1 oznacza że jesteśmy przed pierwszym stanem
      return;
    }
    
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
    } else {
      setIsRestoringHistory(false);
    }
    
    setHistoryIndex(historyIndex - 1);
  }, [history, historyIndex, drawGrid]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    
    setIsRestoringHistory(true);
    
    // Jeśli jesteśmy na -1 (przed pierwszym stanem), przywróć pierwszy stan
    const nextIndex = historyIndex + 1;
    const nextState = history[nextIndex];
    
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
    } else {
      setIsRestoringHistory(false);
    }
    
    setHistoryIndex(nextIndex);
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
  const createTemplateInArea = (templateType: TemplateType, x: number, y: number, width: number, height: number) => {
    let newShapes: Shape[] = [];
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const scale = Math.min(Math.abs(width), Math.abs(height)) / 200; // Scale based on area size
    
    switch (templateType) {
      case 'coordinate-system':
        const axisLength = Math.min(Math.abs(width), Math.abs(height)) / 2 * 0.8;
        newShapes = [{
          id: `shape-${Date.now()}`,
          type: 'axes',
          x: centerX,
          y: centerY,
          color: '#000000',
          strokeWidth: Math.max(1, Math.round(2 * scale))
        }];
        // Add custom axis drawing data
        newShapes[0] = {
          ...newShapes[0],
          width: axisLength * 2,
          height: axisLength * 2
        };
        break;
        
      case 'circle-grid':
        const maxRadius = Math.min(Math.abs(width), Math.abs(height)) / 2 * 0.8;
        for (let i = 1; i <= 3; i++) {
          newShapes.push({
            id: `shape-${Date.now()}-${i}`,
            type: 'circle',
            x: centerX,
            y: centerY,
            radius: (maxRadius / 3) * i,
            color: '#2563eb',
            strokeWidth: Math.max(1, Math.round(1 * scale))
          });
        }
        break;
        
      case 'triangle-template':
        const triangleWidth = Math.abs(width) * 0.8;
        const triangleHeight = Math.abs(height) * 0.8;
        newShapes = [{
          id: `shape-${Date.now()}`,
          type: 'triangle',
          x: centerX - triangleWidth / 2,
          y: centerY - triangleHeight / 2,
          width: triangleWidth,
          height: triangleHeight,
          color: '#dc2626',
          strokeWidth: Math.max(1, Math.round(2 * scale))
        }];
        break;
    }
    
    setShapes(prev => [...prev, ...newShapes]);
    saveToHistory();
  };

  const applyTemplate = (templateName: string) => {
    // Switch to template tool instead of immediately creating template
    setSelectedTemplate(templateName as TemplateType);
    setTool('template');
    setShowTemplateMenu(false);
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

  // Initialize canvas - tylko raz przy pierwszym załadowaniu
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = 600; // domyślna wysokość

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const savedData = localStorage.getItem(`canvas-data-${problemId}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.textElements) setTextElements(parsedData.textElements);
        if (parsedData.shapes) setShapes(parsedData.shapes);
        if (parsedData.canvasHeight) {
          setCanvasHeight(parsedData.canvasHeight);
          canvas.height = parsedData.canvasHeight; // ustaw od razu zapisaną wysokość
        }
        if (parsedData.drawing) {
          const img = new Image();
          img.onload = () => {
            drawGrid(ctx, canvas);
            ctx.drawImage(img, 0, 0);
          };
          img.src = parsedData.drawing;
        } else {
          drawGrid(ctx, canvas);
        }
      } else {
        drawGrid(ctx, canvas);
        // Zapisz stan początkowy (pusty canvas) do historii
        setTimeout(() => {
          const initialState: HistoryState = {
            shapes: [],
            textElements: [],
            drawing: canvas.toDataURL()
          };
          setHistory([initialState]);
          setHistoryIndex(0);
        }, 100);
      }
    } catch (error) {
      console.error('Failed to load canvas data:', error);
      drawGrid(ctx, canvas);
      // Zapisz stan początkowy także w przypadku błędu
      setTimeout(() => {
        const initialState: HistoryState = {
          shapes: [],
          textElements: [],
          drawing: canvas.toDataURL()
        };
        setHistory([initialState]);
        setHistoryIndex(0);
      }, 100);
    }
  }, [problemId, drawGrid]); // usunięte canvasHeight z dependency



  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGrid(ctx, canvas);
    drawShapes(ctx);
    


    // Podgląd obszaru szablonu
    if (currentTemplate) {
      ctx.save();
      ctx.strokeStyle = '#10b981';
      ctx.fillStyle = '#10b981' + '10';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      // Draw template area border
      ctx.strokeRect(currentTemplate.x, currentTemplate.y, currentTemplate.width, currentTemplate.height);
      ctx.fillRect(currentTemplate.x, currentTemplate.y, currentTemplate.width, currentTemplate.height);
      
      // Draw template preview content with dashed lines
      const centerX = currentTemplate.x + currentTemplate.width / 2;
      const centerY = currentTemplate.y + currentTemplate.height / 2;
      const scale = Math.min(Math.abs(currentTemplate.width), Math.abs(currentTemplate.height)) / 200;
      
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = Math.max(1, Math.round(2 * scale));
      ctx.setLineDash([3, 3]);
      
      switch (currentTemplate.type) {
        case 'coordinate-system':
          const axisLength = Math.min(Math.abs(currentTemplate.width), Math.abs(currentTemplate.height)) / 2 * 0.6;
          
          // X axis
          ctx.beginPath();
          ctx.moveTo(centerX - axisLength, centerY);
          ctx.lineTo(centerX + axisLength, centerY);
          ctx.stroke();
          
          // X arrow
          ctx.beginPath();
          ctx.moveTo(centerX + axisLength, centerY);
          ctx.lineTo(centerX + axisLength - 8, centerY - 4);
          ctx.moveTo(centerX + axisLength, centerY);
          ctx.lineTo(centerX + axisLength - 8, centerY + 4);
          ctx.stroke();
          
          // Y axis
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - axisLength);
          ctx.lineTo(centerX, centerY + axisLength);
          ctx.stroke();
          
          // Y arrow
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - axisLength);
          ctx.lineTo(centerX - 4, centerY - axisLength + 8);
          ctx.moveTo(centerX, centerY - axisLength);
          ctx.lineTo(centerX + 4, centerY - axisLength + 8);
          ctx.stroke();
          break;
          
        case 'circle-grid':
          const maxRadius = Math.min(Math.abs(currentTemplate.width), Math.abs(currentTemplate.height)) / 2 * 0.6;
          for (let i = 1; i <= 3; i++) {
            const radius = (maxRadius / 3) * i;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
          }
          break;
          
        case 'triangle-template':
          const triangleWidth = Math.abs(currentTemplate.width) * 0.6;
          const triangleHeight = Math.abs(currentTemplate.height) * 0.6;
          const startX = centerX - triangleWidth / 2;
          const startY = centerY + triangleHeight / 2;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + triangleWidth, startY);
          ctx.lineTo(centerX, centerY - triangleHeight / 2);
          ctx.closePath();
          ctx.stroke();
          break;
      }
      
      // Show template name
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      const text = currentTemplate.type === 'coordinate-system' ? 'Układ współrzędnych' : 
                   currentTemplate.type === 'circle-grid' ? 'Siatka okręgów' : 'Szablon trójkąta';
      const textY = currentTemplate.y < 30 ? currentTemplate.y + Math.abs(currentTemplate.height) + 15 : currentTemplate.y - 5;
      ctx.fillText(text, centerX, textY);
      
      ctx.restore();
    }
    
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
  }, [shapes, currentShape, currentTemplate, drawShapes, drawGrid]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Osobny useEffect dla zmiany wysokości canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.height = canvasHeight;
    redrawCanvas(); // przerysuj canvas po zmianie wysokości
  }, [canvasHeight, redrawCanvas]);

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
          shapes,
          canvasHeight
        };
        localStorage.setItem(`canvas-data-${problemId}`, JSON.stringify(canvasData));
      } catch (error) {
        console.error('Failed to save canvas:', error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [textElements, shapes, canvasHeight, problemId, isRestoringHistory]);

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Jeśli edytujemy tekst, najpierw zakończ edycję
    if (editingTextId && tool !== 'text') {
      setEditingTextId(null);
    }

    const { x, y } = getMousePosition(e);

    if (tool === 'text') {
      // Tworzenie tekstu przez kliknięcie - kompaktowe pole
      const defaultWidth = 120;
      const defaultHeight = 30;
      
      const newTextElement: TextElement = {
        id: `text-${Date.now()}`,
        x,
        y,
        width: defaultWidth,
        height: defaultHeight,
        text: '',
        fontSize,
        color,
        fontWeight,
        fontStyle
      };
      
      setTextElements(prev => [...prev, newTextElement]);
      setEditingTextId(newTextElement.id);
      saveToHistory();
      return;
    }

    if (tool === 'template') {
      // Tworzenie obszaru dla szablonu
      setCurrentTemplate({
        x,
        y,
        width: 0,
        height: 0,
        type: selectedTemplate
      });
      setIsDrawing(true);
      return;
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

      setCurrentShape(newShape);
      setIsDrawing(true);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePosition(e);
    
    if (!isDrawing) {
      // Track mouse position even when not drawing (for ghost cursor)
      setMousePos({ x, y });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Jeśli edytujemy tekst, nie rysuj
    if (editingTextId) return;

    // Rysowanie obszaru dla szablonu
    if (tool === 'template' && currentTemplate) {
      const updatedTemplate = { ...currentTemplate };
      updatedTemplate.width = x - currentTemplate.x;
      updatedTemplate.height = y - currentTemplate.y;
      setCurrentTemplate(updatedTemplate);
      return;
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
    
    // Tekst już nie potrzebuje obsługi w stopDrawing - tworzy się od razu

    if (tool === 'template' && currentTemplate) {
      // Minimalna wielkość template area
      const minSize = 50;
      if (Math.abs(currentTemplate.width) > minSize && Math.abs(currentTemplate.height) > minSize) {
        const templateX = currentTemplate.width < 0 ? currentTemplate.x + currentTemplate.width : currentTemplate.x;
        const templateY = currentTemplate.height < 0 ? currentTemplate.y + currentTemplate.height : currentTemplate.y;
        const templateWidth = Math.abs(currentTemplate.width);
        const templateHeight = Math.abs(currentTemplate.height);
        
        createTemplateInArea(currentTemplate.type, templateX, templateY, templateWidth, templateHeight);
      }
      setCurrentTemplate(null);
      setIsDrawing(false);
      return;
    }
    
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
  ];

  const lineWidths = [
    { name: '2px', value: 2 },
    { name: '4px', value: 4 },
    { name: '6px', value: 6 },
    { name: '8px', value: 8 },
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
  ];

  const templates = [
    { id: 'coordinate-system', name: 'Układ współrzędnych', icon: '📐' },
    { id: 'circle-grid', name: 'Siatka okręgów', icon: '⭕' },
    { id: 'triangle-template', name: 'Szablon trójkąta', icon: '△' },
  ];

  return (
    <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-3 mt-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-[#30363d]">
        {/* Main tools */}
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => { setTool('pen'); setShowShapeMenu(false); setShowTextMenu(false); }}
            className={`p-2 sm:p-2.5 rounded-lg transition-all ${tool === 'pen' ? 'bg-[#58a6ff] text-black shadow-lg' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
            title="Ołówek"
          >
            <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={() => { setTool('eraser'); setShowShapeMenu(false); setShowTextMenu(false); }}
            className={`p-2 sm:p-2.5 rounded-lg transition-all ${tool === 'eraser' ? 'bg-[#58a6ff] text-black shadow-lg' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
            title="Gumka"
          >
            <Eraser className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => { setTool('text'); setShowTextMenu(!showTextMenu); setShowShapeMenu(false); }}
              className={`p-2 sm:p-2.5 rounded-lg transition-all ${tool === 'text' ? 'bg-[#58a6ff] text-black shadow-lg' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
              title="Tekst"
            >
              <Type className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {showTextMenu && (
              <div className="absolute top-full left-0 mt-1 sm:mt-2 bg-[#161b22] border border-[#30363d] rounded-md sm:rounded-lg shadow-xl z-50 p-1.5 sm:p-2 min-w-[140px] sm:min-w-[180px]">
                <div className="mb-2">
                  <label className="text-xs text-gray-400 mb-1 block">Rozmiar</label>
                  {fontSizes.map(fs => (
                    <button
                      key={fs.value}
                      onClick={() => setFontSize(fs.value)}
                      className={`w-full text-left px-2 py-1 rounded-md hover:bg-[#30363d] transition-colors text-xs ${fontSize === fs.value ? 'bg-[#58a6ff]/20' : ''}`}
                    >
                      {fs.name} ({fs.value}px)
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
                    className={`px-2 py-1 rounded-md text-xs font-bold ${fontWeight === 'bold' ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] hover:bg-[#40464d]'}`}
                  >
                    B
                  </button>
                  <button
                    onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
                    className={`px-2 py-1 rounded-md text-xs italic ${fontStyle === 'italic' ? 'bg-[#58a6ff] text-black' : 'bg-[#30363d] hover:bg-[#40464d]'}`}
                  >
                    I
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => { setTool('shape'); setShowShapeMenu(!showShapeMenu); setShowTextMenu(false); setShowTemplateMenu(false); }}
              className={`p-2 sm:p-2.5 rounded-lg transition-all ${tool === 'shape' ? 'bg-[#58a6ff] text-black shadow-lg' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
              title="Kształty"
            >
              <Shapes className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {showShapeMenu && (
              <div className="absolute top-full left-0 mt-1 sm:mt-2 bg-[#161b22] border border-[#30363d] rounded-md sm:rounded-lg shadow-xl z-50 p-1.5 sm:p-2 min-w-[160px] sm:min-w-[200px]">
                {shapeOptions.map(shape => (
                  <button
                    key={shape.type}
                    onClick={() => { setSelectedShape(shape.type); setTool('shape'); setShowShapeMenu(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded-md hover:bg-[#30363d] transition-colors flex items-center gap-2 ${selectedShape === shape.type ? 'bg-[#58a6ff]/20' : ''}`}
                  >
                    <span className="text-lg">{shape.icon}</span>
                    <span className="text-xs">{shape.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setTool('template'); setShowTemplateMenu(!showTemplateMenu); setShowShapeMenu(false); setShowTextMenu(false); }}
              className={`p-2 sm:p-2.5 rounded-lg transition-all ${tool === 'template' ? 'bg-[#58a6ff] text-black shadow-lg' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
              title="Szablony"
            >
              <PlusSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {showTemplateMenu && (
              <div className="absolute top-full left-0 mt-1 sm:mt-2 bg-[#161b22] border border-[#30363d] rounded-md sm:rounded-lg shadow-xl z-50 p-1.5 sm:p-2 min-w-[140px] sm:min-w-[180px]">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t.id as TemplateType);
                      setTool('template');
                      setShowTemplateMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
                      selectedTemplate === t.id ? 'bg-[#58a6ff]/20 text-white' : 'hover:bg-[#30363d] text-white'
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span className="text-xs">{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1 sm:gap-2 pl-2 sm:pl-3 border-l border-[#30363d]">
          <button
            onClick={undo}
            disabled={historyIndex < 0 && (shapes.length === 0 && textElements.length === 0)}
            className="p-2 sm:p-2.5 rounded-lg bg-[#30363d] text-white hover:bg-[#40464d] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Cofnij (Ctrl+Z)"
          >
            <Undo className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 sm:p-2.5 rounded-lg bg-[#30363d] text-white hover:bg-[#40464d] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Ponów (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Copy/Delete */}
        {selectedElements.length > 0 && (
          <div className="flex gap-1 sm:gap-2 pl-2 sm:pl-3 border-l border-[#30363d]">
            <button
              onClick={copySelected}
              className="p-2 sm:p-2.5 rounded-lg bg-[#30363d] text-white hover:bg-[#40464d] transition-all"
              title="Kopiuj (Ctrl+C)"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={deleteSelected}
              className="p-2 sm:p-2.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all border border-red-500/30"
              title="Usuń (Delete)"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Colors */}
        {tool !== 'eraser' && (
          <div className="flex gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-[#30363d]">
            {colors.map(c => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md transition-all border-2 ${
                  color === c.value 
                    ? 'border-[#58a6ff] ring-2 ring-[#58a6ff]/30' 
                    : 'border-[#40464d] hover:border-[#58a6ff]/50'
                } ${c.value === '#000000' ? 'border-white/20' : ''}`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
            <div className="relative">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:w-12 md:h-12 rounded-md cursor-pointer border-2 border-[#40464d] hover:border-[#58a6ff] transition-all"
                title="Wybierz kolor"
              />
            </div>
          </div>
        )}

        {/* Line width */}
        {(tool === 'pen' || tool === 'shape') && (
          <div className="flex gap-1 sm:gap-1.5 pl-2 sm:pl-3 border-l border-[#30363d]">
            {lineWidths.map(lw => (
              <button
                key={lw.value}
                onClick={() => setLineWidth(lw.value)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-center font-medium ${lineWidth === lw.value ? 'bg-[#58a6ff] text-black shadow-lg font-bold' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
                title={`Grubość linii: ${lw.name}`}
              >
                <span className="hidden sm:inline">{lw.name}</span>
                <span className="sm:hidden">{lw.value}</span>
              </button>
            ))}
          </div>
        )}

        {/* Canvas Height Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 pl-1 sm:pl-2 border-l border-[#30363d]">
          <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">Wysokość:</span>
          <span className="text-[10px] sm:text-xs text-gray-400 sm:hidden">H:</span>
          <button
            onClick={() => setCanvasHeight(Math.max(400, canvasHeight - 100))}
            className="p-0.5 sm:p-1 rounded text-[10px] sm:text-xs bg-[#30363d] text-white hover:bg-[#40464d] transition-all w-5 h-5 sm:w-auto sm:h-auto flex items-center justify-center"
            title="Zmniejsz wysokość"
            disabled={canvasHeight <= 400}
          >
            -
          </button>
          <span className="text-[10px] sm:text-xs text-gray-300 min-w-[2rem] sm:min-w-[3rem] text-center">
            <span className="sm:hidden">{canvasHeight}</span>
            <span className="hidden sm:inline">{canvasHeight}px</span>
          </span>
          <button
            onClick={() => setCanvasHeight(Math.min(1200, canvasHeight + 100))}
            className="p-0.5 sm:p-1 rounded text-[10px] sm:text-xs bg-[#30363d] text-white hover:bg-[#40464d] transition-all w-5 h-5 sm:w-auto sm:h-auto flex items-center justify-center"
            title="Zwiększ wysokość"
            disabled={canvasHeight >= 1200}
          >
            +
          </button>
        </div>

        {/* Grid & Export */}
        <div className="flex gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-[#30363d] ml-auto">
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`p-2 sm:p-2.5 rounded-lg transition-all ${snapToGrid ? 'bg-[#58a6ff] text-black shadow-lg' : 'bg-[#30363d] text-white hover:bg-[#40464d]'}`}
            title={`Przyciąganie do siatki (G) - ${snapToGrid ? 'włączone' : 'wyłączone'}`}
          >
            <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={() => exportCanvas('png')}
            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-all border border-green-500/30 text-sm sm:text-base flex items-center gap-2 font-medium"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <button
            onClick={clearCanvas}
            className="p-2 sm:p-2.5 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all border border-red-500/30"
            title="Wyczyść wszystko"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
            tool === 'text' ? 'cursor-text' : 
            tool === 'template' ? 'cursor-copy' : 'cursor-crosshair'
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
                transform: 'translate(0, -50%)',
                pointerEvents: editingTextId === textEl.id ? 'auto' : 'none',
                zIndex: editingTextId === textEl.id ? 50 : 10
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
                  className="bg-white/95 border border-blue-400 px-2 py-1 rounded-md text-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 shadow-sm"
                  style={{
                    fontSize: `${textEl.fontSize}px`,
                    color: textEl.color,
                    fontWeight: textEl.fontWeight,
                    fontStyle: textEl.fontStyle,
                    minWidth: '80px',
                    maxWidth: '200px',
                    width: 'auto'
                  }}
                  placeholder="Tekst..."
                />
              ) : (
                <div
                  className="relative cursor-pointer bg-white/80 px-1.5 py-0.5 rounded text-shadow border border-transparent hover:border-gray-300 hover:bg-white/90 transition-colors inline-block"
                  onClick={() => setEditingTextId(textEl.id)}
                  style={{
                    fontSize: `${textEl.fontSize}px`,
                    color: textEl.color,
                    fontWeight: textEl.fontWeight,
                    fontStyle: textEl.fontStyle,
                    minWidth: textEl.text ? 'auto' : '50px',
                    minHeight: 'auto',
                    pointerEvents: 'auto',
                    maxWidth: 'fit-content',
                    paddingRight: '6px' // dodatkowy padding z prawej strony na krzyżyk
                  }}
                >
                  {textEl.text || 'Tekst'}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTextElements(prev => prev.filter(el => el.id !== textEl.id));
                    }}
                    className="absolute top-0 text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ 
                      fontSize: '12px', 
                      lineHeight: '1', 
                      fontWeight: 'bold',
                      left: '100%',
                      marginLeft: '2px'
                    }}
                    title="Usuń tekst"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Hints */}
        {tool === 'text' && textElements.length === 0 && (
          <div className="absolute top-4 left-4 bg-blue-900/80 text-blue-200 px-3 py-2 rounded-lg text-sm pointer-events-none">
            Kliknij w miejsce gdzie chcesz dodać tekst
          </div>
        )}
        

        
        {tool === 'shape' && shapes.length === 0 && !currentShape && (
          <div className="absolute top-4 left-4 bg-purple-900/80 text-purple-200 px-3 py-2 rounded-lg text-sm pointer-events-none">
            Kliknij i przeciągnij, aby narysować {shapeOptions.find(s => s.type === selectedShape)?.name.toLowerCase()}
          </div>
        )}

        {tool === 'template' && !currentTemplate && (
          <div className="absolute top-4 left-4 bg-green-900/80 text-green-200 px-3 py-2 rounded-lg text-sm pointer-events-none">
            Zaznacz obszar dla szablonu: {selectedTemplate === 'coordinate-system' ? 'Układ współrzędnych' : 
                                       selectedTemplate === 'circle-grid' ? 'Siatka okręgów' : 'Szablon trójkąta'}
          </div>
        )}
        

      </div>

      {/* Keyboard shortcuts info */}
      <div className="mt-1 sm:mt-2 text-[8px] sm:text-[10px] text-gray-500 flex flex-wrap gap-1 sm:gap-3">
        <span className="hidden sm:inline">Ctrl+Z: Cofnij</span>
        <span className="hidden sm:inline">Ctrl+Shift+Z: Ponów</span>
        <span className="hidden sm:inline">Ctrl+C: Kopiuj</span>
        <span className="hidden sm:inline">Ctrl+V: Wklej</span>
        <span className="hidden sm:inline">Delete: Usuń zaznaczone</span>
        <span className="hidden sm:inline">G: Przełącz siatkę</span>
        <span className="sm:hidden">Ctrl+Z/Y: Undo/Redo</span>
        <span className="sm:hidden">G: Siatka</span>
      </div>
    </div>
  );
}
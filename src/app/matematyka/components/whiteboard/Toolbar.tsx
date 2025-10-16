import React, { useState } from 'react';
import { 
  MousePointer2, Hand, PenTool, Type, Square, Circle, Triangle, 
  Minus, ArrowRight, Undo, Redo, ZoomIn, ZoomOut, 
  Trash2, Copy, Home
} from 'lucide-react';

export type Tool = 'select' | 'pan' | 'pen' | 'text' | 'shape';
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  selectedShape: ShapeType;
  setSelectedShape: (shape: ShapeType) => void;
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fillShape: boolean;
  setFillShape: (fill: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onResetView: () => void;  // 🏠 MIRO-style Home button
  onCopy?: () => void;
  onPaste?: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// Separate Zoom Controls Component
export function ZoomControls({ 
  zoom, 
  onZoomIn, 
  onZoomOut,
  onResetView
}: { 
  zoom: number; 
  onZoomIn: () => void; 
  onZoomOut: () => void;
  onResetView: () => void;
}) {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10 pointer-events-auto">
      <div className="flex items-center gap-1 p-1.5">
        {/* Home button - Reset View */}
        <button
          onClick={onResetView}
          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors border-r border-gray-200"
          title="Wróć do początku (Home)"
        >
          <Home className="w-4 h-4" />
        </button>
        
        <button
          onClick={onZoomOut}
          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Oddal"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        
        <span className="text-xs font-medium text-gray-700 min-w-[45px] text-center px-1">
          {Math.round(zoom * 100)}%
        </span>
        
        <button
          onClick={onZoomIn}
          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Przybliż"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Toolbar({
  tool,
  setTool,
  selectedShape,
  setSelectedShape,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  fontSize,
  setFontSize,
  fillShape,
  setFillShape,
  onUndo,
  onRedo,
  onClear,
  onResetView,
  onCopy,
  canUndo,
  canRedo
}: ToolbarProps) {
  const [showShapePicker, setShowShapePicker] = useState(false);

  const ToolButton = ({ 
    icon: Icon, 
    active, 
    onClick, 
    title,
    disabled = false,
    badge,
    color: btnColor
  }: { 
    icon: any; 
    active: boolean; 
    onClick: () => void; 
    title: string;
    disabled?: boolean;
    badge?: string;
    color?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative p-1.5 rounded transition-colors group
        ${active 
          ? 'bg-blue-500 text-white' 
          : 'text-gray-700 hover:bg-gray-100'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <Icon className="w-4 h-4" style={btnColor ? { color: btnColor } : {}} />
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center text-[10px]">
          {badge}
        </span>
      )}
      {/* Tooltip */}
      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {title}
      </span>
    </button>
  );

  const Divider = () => (
    <div className="w-px h-6 bg-gray-200 mx-0.5" />
  );

  const getShapeIcon = () => {
    switch(selectedShape) {
      case 'circle': return Circle;
      case 'triangle': return Triangle;
      case 'line': return Minus;
      case 'arrow': return ArrowRight;
      default: return Square;
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10 pointer-events-auto">
      <div className="flex items-center gap-0.5 p-1.5">
        {/* Main Tools */}
        <div className="flex items-center gap-0.5">
          <ToolButton
            icon={MousePointer2}
            active={tool === 'select'}
            onClick={() => setTool('select')}
            title="Zaznacz (V)"
          />
          
          <ToolButton
            icon={Hand}
            active={tool === 'pan'}
            onClick={() => setTool('pan')}
            title="Przesuń widok (H)"
          />
          
          <Divider />
          
          <ToolButton
            icon={PenTool}
            active={tool === 'pen'}
            onClick={() => setTool('pen')}
            title="Rysuj (P)"
          />
          
          {/* Shape Tool with dropdown - IMPROVED VISIBILITY */}
          <div className="relative">
            <ToolButton
              icon={getShapeIcon()}
              active={tool === 'shape'}
              onClick={() => {
                setTool('shape');
                setShowShapePicker(!showShapePicker);
              }}
              title="Kształty (S)"
            />
            
            {showShapePicker && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-2xl border-2 border-gray-300 p-3 z-50 min-w-[200px]">
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedShape('rectangle');
                      setTool('shape');
                      setShowShapePicker(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedShape === 'rectangle' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Square className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Prostokąt</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedShape('circle');
                      setTool('shape');
                      setShowShapePicker(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedShape === 'circle' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Circle className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Koło</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedShape('triangle');
                      setTool('shape');
                      setShowShapePicker(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedShape === 'triangle' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Triangle className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Trójkąt</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedShape('line');
                      setTool('shape');
                      setShowShapePicker(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedShape === 'line' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Minus className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Linia</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedShape('arrow');
                      setTool('shape');
                      setShowShapePicker(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedShape === 'arrow' ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Strzałka</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <ToolButton
            icon={Type}
            active={tool === 'text'}
            onClick={() => setTool('text')}
            title="Tekst (T)"
          />
          
          <Divider />
          
          {/* Color Picker */}
          <div className="relative">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
              title="Wybierz kolor"
            />
          </div>
          
          {/* Line Width */}
          <div className="flex items-center gap-1 px-1">
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              title={`Grubość: ${lineWidth}px`}
            />
            <span className="text-[10px] text-gray-600 w-4">{lineWidth}</span>
          </div>
          
          {/* Fill Toggle */}
          {tool === 'shape' && selectedShape !== 'line' && selectedShape !== 'arrow' && (
            <button
              onClick={() => setFillShape(!fillShape)}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                fillShape 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Wypełnienie"
            >
              {fillShape ? 'Wypełniony' : 'Kontur'}
            </button>
          )}

          {/* Font Size for Text Tool - REMOVED */}
        </div>
        
        <Divider />
        
        <ToolButton
          icon={Undo}
          active={false}
          onClick={onUndo}
          disabled={!canUndo}
          title="Cofnij (Ctrl+Z)"
        />
        
        <ToolButton
          icon={Redo}
          active={false}
          onClick={onRedo}
          disabled={!canRedo}
          title="Ponów (Ctrl+Y)"
        />
        
        <Divider />
        
        <ToolButton
          icon={Trash2}
          active={false}
          onClick={onClear}
          title="Wyczyść tablicę"
        />
      </div>
    </div>
  );
}
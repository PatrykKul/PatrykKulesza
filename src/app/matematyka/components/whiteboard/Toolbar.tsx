import React from 'react';
import { 
  MousePointer2, PenTool, Eraser, Type, Square, Circle, Triangle, 
  Minus, Undo, Redo, ZoomIn, ZoomOut, Trash2, Calculator, Hand
} from 'lucide-react';

export type Tool = 'select' | 'pen' | 'eraser' | 'text' | 'shape' | 'pan';
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line';

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
  onZoomIn: () => void;
  onZoomOut: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  showCalculator: boolean;
  setShowCalculator: (show: boolean) => void;
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
  onZoomIn,
  onZoomOut,
  canUndo,
  canRedo,
  zoom,
  showCalculator,
  setShowCalculator
}: ToolbarProps) {
  const [activePanel, setActivePanel] = React.useState<Tool | null>(null);

  const togglePanel = (panelTool: Tool) => {
    if (tool === panelTool && activePanel === panelTool) {
      setActivePanel(null);
    } else {
      setTool(panelTool);
      setActivePanel(panelTool);
    }
  };

  const ToolButton = ({ 
    icon: Icon, 
    active, 
    onClick, 
    title,
    disabled = false 
  }: { 
    icon: any; 
    active: boolean; 
    onClick: () => void; 
    title: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative p-2.5 rounded-lg transition-all duration-200
        ${active 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <>
      {/* Main Toolbar */}
      <div className="absolute left-4 top-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 flex flex-col gap-1 z-50">
        <ToolButton
          icon={MousePointer2}
          active={tool === 'select'}
          onClick={() => {
            setTool('select');
            setActivePanel(null);
          }}
          title="Zaznaczanie (V)"
        />
        
        <ToolButton
          icon={Hand}
          active={tool === 'pan'}
          onClick={() => {
            setTool('pan');
            setActivePanel(null);
          }}
          title="Przesuwanie (H)"
        />
        
        <ToolButton
          icon={PenTool}
          active={tool === 'pen'}
          onClick={() => togglePanel('pen')}
          title="Pisak (P)"
        />
        
        <ToolButton
          icon={Eraser}
          active={tool === 'eraser'}
          onClick={() => togglePanel('eraser')}
          title="Gumka (E)"
        />
        
        <ToolButton
          icon={selectedShape === 'rectangle' ? Square : 
                 selectedShape === 'circle' ? Circle : 
                 selectedShape === 'triangle' ? Triangle : Minus}
          active={tool === 'shape'}
          onClick={() => togglePanel('shape')}
          title="Kształty (S)"
        />
        
        <ToolButton
          icon={Type}
          active={tool === 'text'}
          onClick={() => togglePanel('text')}
          title="Tekst (T)"
        />

        <div className="h-px bg-gray-200 my-1" />
        
        <ToolButton
          icon={Calculator}
          active={showCalculator}
          onClick={() => setShowCalculator(!showCalculator)}
          title="Kalkulator"
        />
        
        <ToolButton
          icon={Trash2}
          active={false}
          onClick={onClear}
          title="Wyczyść wszystko"
        />
        
        <div className="h-px bg-gray-200 my-1" />
        
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
      </div>

      {/* Secondary Panel - Właściwości narzędzia */}
      {activePanel && (
        <div className="absolute left-20 top-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-64 z-40">
          {/* Pisak */}
          {activePanel === 'pen' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Kolor
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          color === c ? 'border-blue-500 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Grubość: {lineWidth}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Cienka</span>
                  <span>Gruba</span>
                </div>
              </div>
            </div>
          )}

          {/* Gumka */}
          {activePanel === 'eraser' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Rozmiar gumki: {lineWidth}px
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Kształty */}
          {activePanel === 'shape' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Wybierz kształt
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setSelectedShape('rectangle')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedShape === 'rectangle'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Square className="w-6 h-6 mx-auto text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedShape('circle')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedShape === 'circle'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Circle className="w-6 h-6 mx-auto text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedShape('triangle')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedShape === 'triangle'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Triangle className="w-6 h-6 mx-auto text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedShape('line')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedShape === 'line'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Minus className="w-6 h-6 mx-auto text-gray-700" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Kolor
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          color === c ? 'border-blue-500 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fillShape}
                    onChange={(e) => setFillShape(e.target.checked)}
                    className="w-4 h-4 text-blue-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Wypełnij kształt
                  </span>
                </label>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Grubość: {lineWidth}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Tekst */}
          {activePanel === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Kolor tekstu
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <div className="flex flex-wrap gap-2">
                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'].map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          color === c ? 'border-blue-500 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Rozmiar: {fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mały</span>
                  <span>Duży</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zoom Controls - Bottom Left */}
      <div className="absolute left-4 bottom-4 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-2 z-40">
        <button
          onClick={onZoomOut}
          className="p-1 text-gray-700 hover:text-blue-500 transition-colors"
          title="Oddal"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        
        <span className="text-sm font-medium text-gray-700 min-w-[45px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <button
          onClick={onZoomIn}
          className="p-1 text-gray-700 hover:text-blue-500 transition-colors"
          title="Przybliż"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
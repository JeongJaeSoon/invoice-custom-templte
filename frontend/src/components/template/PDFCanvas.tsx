import React, { CSSProperties, useRef, useState } from 'react';
import { ComponentItem } from './ComponentList';
import Moveable, { OnDragStart, OnDrag, OnResize } from 'react-moveable';

// A4 사이즈 (mm 단위)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// mm를 픽셀로 변환 (96 DPI 기준)
const MM_TO_PX = 3.7795275591;

export type ComponentType = 'title' | 'text' | 'table' | 'image' | 'signature' | 'qrcode';

export interface CanvasComponent extends ComponentItem {
  id: string; // ComponentItem에 id가 없을 경우를 대비
  name: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
  color?: string;
  };
  content?: {
    text?: string;
    rows?: number;
    columns?: number;
    imageUrl?: string;
    qrData?: string;
  };
}

interface PDFCanvasProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentClick?: (component: CanvasComponent) => void;
  onComponentUpdate?: (componentId: string, updates: Partial<CanvasComponent>) => void;
}

const PDFCanvas: React.FC<PDFCanvasProps> = ({
  components,
  selectedComponent,
  onComponentClick,
  onComponentUpdate,
}) => {
  const canvasWidth = A4_WIDTH_MM * MM_TO_PX;
  const canvasHeight = A4_HEIGHT_MM * MM_TO_PX;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const handleDragStart = (e: OnDragStart): void => {
    const htmlTarget = e.target as HTMLElement;
    const componentId = htmlTarget.getAttribute('data-component-id');
    const component = components.find((c) => c.id === componentId);
    if (component) {
      setDragStart({ x: component.x, y: component.y });
    }
  };

  const handleDrag = (e: OnDrag): void => {
    const htmlTarget = e.target as HTMLElement;
    const componentId = htmlTarget.getAttribute('data-component-id');
    if (!componentId || !onComponentUpdate || !dragStart) return;

    const [deltaX, deltaY] = e.delta;
    onComponentUpdate(componentId, {
      x: dragStart.x + deltaX,
      y: dragStart.y + deltaY,
    });
  };

  const handleDragEnd = (): void => {
    setDragStart(null);
  };

  const handleResize = (e: OnResize): void => {
    const htmlTarget = e.target as HTMLElement;
    const componentId = htmlTarget.getAttribute('data-component-id');
    if (!componentId || !onComponentUpdate) return;

    onComponentUpdate(componentId, {
      width: e.width,
      height: e.height,
    });
  };

  const handleDoubleClick = (component: CanvasComponent, e: React.MouseEvent): void => {
    e.stopPropagation();
    if (component.type !== 'title' && component.type !== 'text') return;
    setIsEditing(true);
  };

  const handleContentEdit = (component: CanvasComponent, e: React.FormEvent<HTMLDivElement>): void => {
    const text = (e.target as HTMLDivElement).innerText;
    onComponentUpdate?.(component.id, {
      content: {
        ...component.content,
        text,
      },
    });
  };

  const handleBlur = (): void => {
    setIsEditing(false);
  };

  const renderComponentContent = (component: CanvasComponent) => {
    const style: CSSProperties = {
      fontSize: component.style?.fontSize ? `${component.style.fontSize}px` : undefined,
      fontWeight: component.style?.fontWeight,
      textAlign: component.style?.textAlign,
      color: component.style?.color,
      width: '100%',
      height: '100%',
      outline: 'none',
    };

    switch (component.type) {
      case 'title':
      case 'text':
        return (
          <div
            style={style}
            contentEditable={selectedComponent?.id === component.id}
            suppressContentEditableWarning
            onInput={(e) => handleContentEdit(component, e)}
            onBlur={handleBlur}
            onDoubleClick={(e) => handleDoubleClick(component, e)}
            className="w-full h-full"
          >
            {component.content?.text || component.name}
          </div>
        );
      case 'table': {
        const rows = component.content?.rows || 2;
        const columns = component.content?.columns || 2;
        return (
          <table className="w-full h-full border-collapse">
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 p-1"
                      style={style}
                      contentEditable={selectedComponent?.id === component.id}
                      suppressContentEditableWarning
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      case 'image':
        return component.content?.imageUrl ? (
          <img
            src={component.content.imageUrl}
            alt="이미지"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300">
            이미지를 추가하세요
          </div>
        );
      case 'signature':
        return (
          <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300">
            서명
          </div>
        );
      case 'qrcode':
        return (
          <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300">
            QR 코드
          </div>
        );
      default:
        return <div className="text-sm">{component.name}</div>;
    }
  };

  const renderComponent = (component: CanvasComponent) => {
    const style: CSSProperties = {
      position: 'absolute',
      left: `${component.x}px`,
      top: `${component.y}px`,
      width: `${component.width}px`,
      height: `${component.height}px`,
      border: selectedComponent?.id === component.id ? '2px solid #3b82f6' : '1px dashed #ccc',
      padding: '4px',
      cursor: isEditing ? 'text' : 'move',
      backgroundColor: 'white',
    };

    return (
      <div
        key={component.id}
        data-component-id={component.id}
        style={style}
        onClick={() => onComponentClick?.(component)}
      >
        {renderComponentContent(component)}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-white shadow-lg mx-auto"
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        margin: '2rem auto',
      }}
    >
      {components.map(renderComponent)}
      {selectedComponent && containerRef.current && !isEditing && (
        <Moveable
          target={`[data-component-id="${selectedComponent.id}"]`}
          container={containerRef.current}
          draggable={true}
          resizable={true}
          snappable={true}
          origin={false}
          dragTarget={isEditing ? undefined : `[data-component-id="${selectedComponent.id}"]`}
          bounds={{
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            position: 'css',
          }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onResize={handleResize}
        />
      )}
    </div>
  );
};

export default PDFCanvas;

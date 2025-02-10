import React, { CSSProperties, useRef, useState, useCallback } from 'react';
import { ComponentItem } from './ComponentList';

// A4 사이즈 (mm 단위)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// mm를 픽셀로 변환 (96 DPI 기준)
const MM_TO_PX = 3.7795275591;

export type ComponentType = 'title' | 'text' | 'table' | 'image' | 'signature' | 'qrcode';

export interface CanvasComponent extends ComponentItem {
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
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent, component: CanvasComponent) => {
    if (isEditing) return;
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsDragging(true);
    onComponentClick?.(component);
    
    e.preventDefault();
    e.stopPropagation();
  }, [isEditing, onComponentClick]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedComponent || !containerRef.current || isEditing) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    // 캔버스 경계 내로 제한
    const boundedX = Math.max(0, Math.min(newX, canvasWidth - selectedComponent.width));
    const boundedY = Math.max(0, Math.min(newY, canvasHeight - selectedComponent.height));

    onComponentUpdate?.(selectedComponent.id, {
      x: boundedX,
      y: boundedY
    });
  }, [isDragging, selectedComponent, dragOffset, canvasWidth, canvasHeight, isEditing, onComponentUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 마우스 이벤트 리스너 등록
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleDoubleClick = (component: CanvasComponent, e: React.MouseEvent): void => {
    e.stopPropagation();
    if (component.type !== 'title' && component.type !== 'text') return;
    setIsEditing(true);
  };

  const handleContentEdit = (component: CanvasComponent, e: React.FormEvent<HTMLDivElement>): void => {
    const text = (e.target as HTMLDivElement).innerText;
    if (!component.content) return;
    
    onComponentUpdate?.(component.id, {
      content: {
        ...component.content,
        text,
      },
    });
  };

  const renderComponentContent = (component: CanvasComponent) => {
    switch (component.type) {
      case 'text':
      case 'title':
        return (
          <div
            contentEditable={isEditing && selectedComponent?.id === component.id}
            onBlur={() => setIsEditing(false)}
            onInput={(e) => handleContentEdit(component, e)}
            suppressContentEditableWarning
          >
            {component.content?.text || '텍스트를 입력하세요'}
          </div>
        );
      case 'table':
        return <div>테이블</div>;
      case 'image':
        return component.content?.imageUrl ? (
          <img
            src={component.content.imageUrl}
            alt="이미지"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div>이미지</div>
        );
      case 'signature':
        return <div>서명</div>;
      case 'qrcode':
        return <div>QR 코드</div>;
      default:
        return null;
    }
  };

  const renderComponent = (component: CanvasComponent) => {
    const isSelected = selectedComponent?.id === component.id;
    const isCurrentlyDragging = isDragging && isSelected;

    const style: CSSProperties = {
      position: 'absolute',
      left: component.x,
      top: component.y,
      width: component.width,
      height: component.height,
      border: isSelected ? '2px solid #2196f3' : '1px dashed #ccc',
      cursor: isCurrentlyDragging ? 'grabbing' : 'grab',
      fontSize: component.style?.fontSize ? `${component.style.fontSize}px` : '16px',
      fontWeight: component.style?.fontWeight || 'normal',
      textAlign: component.style?.textAlign || 'left',
      color: component.style?.color || '#000000',
      backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.05)' : 'white',
      overflow: 'hidden',
      userSelect: 'none',
      transition: 'background-color 0.2s, border 0.2s',
      boxShadow: isSelected ? '0 0 8px rgba(33, 150, 243, 0.4)' : 'none',
    };

    return (
      <div
        key={component.id}
        data-component-id={component.id}
        style={style}
        onMouseDown={(e) => handleMouseDown(e, component)}
        onDoubleClick={(e) => handleDoubleClick(component, e)}
      >
        {renderComponentContent(component)}
        <div
          style={{
            position: 'absolute',
            right: 2,
            bottom: 2,
            fontSize: '10px',
            color: '#666',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '2px 4px',
            borderRadius: '3px',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>{getComponentIcon(component.type)}</span>
          <span>{component.name}</span>
          <span style={{ opacity: 0.7 }}>#{component.id.slice(-4)}</span>
        </div>
      </div>
    );
  };

  const getComponentIcon = (type: ComponentType): string => {
    switch (type) {
      case 'title':
        return '📌';
      case 'text':
        return '📝';
      case 'table':
        return '📊';
      case 'image':
        return '🖼️';
      case 'signature':
        return '✍️';
      case 'qrcode':
        return '📱';
      default:
        return '📄';
    }
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
    </div>
  );
};

export default PDFCanvas;

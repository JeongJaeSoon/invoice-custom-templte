import React, { CSSProperties, useRef, useState, useCallback, useEffect } from 'react';
import Moveable from 'react-moveable';
import { TableComponent } from './TableComponent';
import { ComponentType, CanvasComponent, INITIAL_COMPONENT_SETTINGS, COMPONENT_ICONS } from '../../types/CanvasComponent';

// A4 사이즈 (mm 단위)
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// mm를 픽셀로 변환 (96 DPI 기준)
const MM_TO_PX = 3.7795275591;

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
  const moveableRef = useRef<Moveable>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleMouseDown = useCallback((e: React.MouseEvent, component: CanvasComponent) => {
    if (isEditing) return;
    onComponentClick?.(component);
    e.preventDefault();
    e.stopPropagation();
  }, [isEditing, onComponentClick]);

  const handleDoubleClick = (component: CanvasComponent, e: React.MouseEvent): void => {
    e.stopPropagation();
    if (component.type !== 'text') return;
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
        return (
          <TableComponent
            data={component.content?.tableData || {}}
            rows={component.content?.rows || INITIAL_COMPONENT_SETTINGS.TABLE.ROWS}
            columns={component.content?.columns || INITIAL_COMPONENT_SETTINGS.TABLE.COLUMNS}
            onDataChange={(newData: { [key: string]: string }) => {
              onComponentUpdate?.(component.id, {
                content: {
                  rows: component.content?.rows || INITIAL_COMPONENT_SETTINGS.TABLE.ROWS,
                  columns: component.content?.columns || INITIAL_COMPONENT_SETTINGS.TABLE.COLUMNS,
                  tableData: newData,
                },
              });
            }}
          />
        );
      case 'image':
        return component.content?.imageUrl ? (
          <img
            src={component.content.imageUrl}
            alt="이미지"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: 'transparent'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 text-3xl mb-2">🖼️</div>
              <div className="text-sm text-gray-500">이미지를 추가해주세요</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderComponent = (component: CanvasComponent) => {
    const isSelected = selectedComponent?.id === component.id;

    const style: CSSProperties = {
      position: 'absolute',
      left: component.x,
      top: component.y,
      width: component.width,
      height: component.height,
      border: isSelected ? '2px solid #2196f3' : '1px dashed #ccc',
      cursor: isSelected ? 'grab' : 'default',
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
    return COMPONENT_ICONS[type];
  };

  // 컴포넌트의 좌표나 크기가 업데이트 될 때 Moveable UI를 업데이트
  useEffect(() => {
    if (selectedComponent) {
      moveableRef.current?.updateRect();
    }
  }, [selectedComponent]);

  return (
    <div
      ref={containerRef}
      className="relative bg-white shadow-lg mx-auto"
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        // margin: '2rem auto',
      }}
    >
      {components.map(renderComponent)}
      {selectedComponent && (
        <Moveable
          ref={moveableRef}
          target={`[data-component-id="${selectedComponent.id}"]`}
          container={containerRef.current}
          draggable={true}
          resizable={true}
          scalable={false}
          keepRatio={false}
          snappable={true}
          bounds={{
            left: 0,
            top: 0,
            right: canvasWidth,
            bottom: canvasHeight
          }}
          throttleResize={1}
          throttleDrag={1}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          edge={true}
          zoom={1}
          origin={false}
          padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
          elementGuidelines={components
            .filter(comp => comp.id !== selectedComponent.id)
            .map(comp => `[data-component-id="${comp.id}"]`)}
          snapThreshold={5}
          isDisplaySnapDigit={true}
          verticalGuidelines={[0, canvasWidth / 2, canvasWidth]}
          horizontalGuidelines={[0, canvasHeight / 2, canvasHeight]}
          onResizeStart={e => {
            e.setMin([10, 10]);
            // 리사이즈 시작 시 현재 위치 저장
            if (e.dragStart) {
              e.dragStart.set([selectedComponent.x, selectedComponent.y]);
            }
          }}
          onResize={e => {
            if (!selectedComponent) return;

            const newWidth = e.width;
            const newHeight = e.height;
            const newX = e.drag.beforeTranslate[0];
            const newY = e.drag.beforeTranslate[1];

            // 경계 체크
            const boundedX = Math.max(0, Math.min(newX, canvasWidth - newWidth));
            const boundedY = Math.max(0, Math.min(newY, canvasHeight - newHeight));

            e.target.style.width = `${newWidth}px`;
            e.target.style.height = `${newHeight}px`;
            e.target.style.left = `${boundedX}px`;
            e.target.style.top = `${boundedY}px`;
            e.target.style.transform = 'none';

            onComponentUpdate?.(selectedComponent.id, {
              width: newWidth,
              height: newHeight,
              x: boundedX,
              y: boundedY,
            });
          }}
          onDragStart={e => {
            // 드래그 시작 시 현재 위치 저장
            e.set([selectedComponent.x, selectedComponent.y]);
          }}
          onDrag={e => {
            if (!selectedComponent) return;

            // 드래그 중인 위치 계산
            const newX = e.beforeTranslate[0];
            const newY = e.beforeTranslate[1];

            // 경계 체크
            const boundedX = Math.max(0, Math.min(newX, canvasWidth - selectedComponent.width));
            const boundedY = Math.max(0, Math.min(newY, canvasHeight - selectedComponent.height));

            // 스타일 업데이트
            e.target.style.left = `${boundedX}px`;
            e.target.style.top = `${boundedY}px`;
            e.target.style.transform = 'none';

            // 상태 업데이트
            onComponentUpdate?.(selectedComponent.id, {
              x: boundedX,
              y: boundedY,
            });
          }}
          onDragEnd={() => {
            // 드래그 종료 시 Moveable UI 업데이트
            moveableRef.current?.updateRect();
          }}
        />
      )}
    </div>
  );
};

export default PDFCanvas;

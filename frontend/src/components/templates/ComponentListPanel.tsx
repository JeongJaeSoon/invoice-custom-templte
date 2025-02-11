import React, { useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CanvasComponent } from '../../types/CanvasComponent';


interface ComponentListPanelProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentSelect: (component: CanvasComponent) => void;
  onComponentDelete: (componentId: string) => void;
  onComponentsReorder: (components: CanvasComponent[]) => void;
}

interface DraggableComponentItemProps {
  component: CanvasComponent;
  index: number;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  selectedComponent?: CanvasComponent;
  onComponentSelect: (component: CanvasComponent) => void;
  onComponentDelete: (componentId: string) => void;
}

const DraggableComponentItem: React.FC<DraggableComponentItemProps> = ({
  component,
  index,
  moveComponent,
  selectedComponent,
  onComponentSelect,
  onComponentDelete,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'COMPONENT',
    hover: (item: { index: number }) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between p-2 rounded border transition-colors duration-200 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        selectedComponent?.id === component.id
          ? 'bg-blue-50 border-blue-200'
          : 'bg-gray-50 border-gray-200 hover:bg-blue-50'
      }`}
      onClick={() => onComponentSelect(component)}
    >
      <div className="flex items-center space-x-2">
        <div className="cursor-move p-1">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9h8M8 15h8"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium">{component.name}</p>
          <p className="text-xs text-gray-500">ID: {component.id}</p>
        </div>
      </div>
      <button
        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onComponentDelete(component.id);
        }}
        title="삭제"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

const ComponentListPanel: React.FC<ComponentListPanelProps> = ({
  components,
  selectedComponent,
  onComponentSelect,
  onComponentDelete,
  onComponentsReorder,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const moveComponent = (dragIndex: number, hoverIndex: number) => {
    const dragComponent = components[dragIndex];
    const newComponents = [...components];
    newComponents.splice(dragIndex, 1);
    newComponents.splice(hoverIndex, 0, dragComponent);

    const updatedComponents = newComponents.map((item, idx) => ({
      ...item,
      zIndex: newComponents.length - idx,
    }));

    onComponentsReorder(updatedComponents);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 border-b border-gray-200" ref={containerRef}>
        <h3 className="text-sm font-medium mb-2">추가된 컴포넌트</h3>
        <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
          {components.map((component, index) => (
            <DraggableComponentItem
              key={component.id}
              component={component}
              index={index}
              moveComponent={moveComponent}
              selectedComponent={selectedComponent}
              onComponentSelect={onComponentSelect}
              onComponentDelete={onComponentDelete}
            />
          ))}
          {components.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">
              추가된 컴포넌트가 없습니다
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default ComponentListPanel;

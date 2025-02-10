import React from 'react';
import { ComponentItem } from './ComponentList';

interface CanvasComponent extends ComponentItem {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ComponentListPanelProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentSelect: (component: CanvasComponent) => void;
  onComponentDelete: (componentId: string) => void;
}

const ComponentListPanel: React.FC<ComponentListPanelProps> = ({
  components,
  selectedComponent,
  onComponentSelect,
  onComponentDelete,
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium mb-2">추가된 컴포넌트</h3>
      <div className="space-y-2">
        {components.map((component) => (
          <div
            key={component.id}
            className={`flex items-center justify-between p-2 rounded ${
              selectedComponent?.id === component.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            } border`}
          >
            <button
              className="flex-1 text-left text-sm"
              onClick={() => onComponentSelect(component)}
            >
              {component.name}
            </button>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => onComponentDelete(component.id)}
            >
              삭제
            </button>
          </div>
        ))}
        {components.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            추가된 컴포넌트가 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentListPanel;

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
  // 같은 편집 동작을 단순 클릭, 더블 클릭 시 모두 실행하도록 처리합니다.
  const handleSelect = (component: CanvasComponent) => {
    onComponentSelect(component);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium mb-2">추가된 컴포넌트</h3>
      <div className="space-y-2">
        {components.map((component) => (
          <div
            key={component.id}
            onClick={() => handleSelect(component)}
            onDoubleClick={(e) => {
              // 더블 클릭 시에도 편집 동작이 작동하도록 하고, 이벤트 전파는 막습니다.
              e.preventDefault();
              e.stopPropagation();
              handleSelect(component);
            }}
            className={`flex items-center justify-between p-2 rounded border transition-colors duration-200 cursor-pointer ${
              selectedComponent?.id === component.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200 hover:bg-blue-50'
            }`}
          >
            <div>
              <p className="text-sm font-medium">{component.name}</p>
              <p className="text-xs text-gray-500">ID: {component.id}</p>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-blue-500 hover:text-blue-700 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(component);
                }}
              >
                편집
              </button>
              <button
                className="text-red-500 hover:text-red-700 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onComponentDelete(component.id);
                }}
              >
                삭제
              </button>
            </div>
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

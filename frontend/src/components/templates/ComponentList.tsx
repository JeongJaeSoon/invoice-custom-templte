import React from 'react';
import { ComponentType, ComponentItem, INITIAL_COMPONENT_SETTINGS } from '../../types/CanvasComponent';

interface ComponentListProps {
  onComponentSelect: (component: ComponentItem) => void;
}

const AVAILABLE_COMPONENTS: ComponentItem[] = [
  { id: 'text', name: '텍스트', type: 'text' },
  { id: 'table', name: '테이블', type: 'table' },
  { id: 'image', name: '이미지', type: 'image' },
];

const ComponentList: React.FC<ComponentListProps> = ({ onComponentSelect }) => {
  const handleComponentSelect = (component: ComponentItem) => {
    const getInitialSettings = (type: ComponentType) => {
      switch (type) {
        case 'text':
          return {
            width: INITIAL_COMPONENT_SETTINGS.TEXT.WIDTH,
            height: INITIAL_COMPONENT_SETTINGS.TEXT.HEIGHT,
            style: { ...INITIAL_COMPONENT_SETTINGS.TEXT.STYLE },
            x: 0,
            y: 0,
            zIndex: 0,
          };
        case 'table':
          return {
            width: INITIAL_COMPONENT_SETTINGS.TABLE.WIDTH,
            height: INITIAL_COMPONENT_SETTINGS.TABLE.HEIGHT,
            content: {
              rows: INITIAL_COMPONENT_SETTINGS.TABLE.ROWS,
              columns: INITIAL_COMPONENT_SETTINGS.TABLE.COLUMNS,
              tableData: {},
              columnSizes: INITIAL_COMPONENT_SETTINGS.TABLE.getDefaultColumnSizes(INITIAL_COMPONENT_SETTINGS.TABLE.COLUMNS),
              rowSizes: INITIAL_COMPONENT_SETTINGS.TABLE.getDefaultRowSizes(INITIAL_COMPONENT_SETTINGS.TABLE.ROWS),
            },
            x: 0,
            y: 0,
            zIndex: 0,
          };
        case 'image':
          return {
            width: INITIAL_COMPONENT_SETTINGS.IMAGE.WIDTH,
            height: INITIAL_COMPONENT_SETTINGS.IMAGE.HEIGHT,
            x: 0,
            y: 0,
            zIndex: 0,
          };
        default:
          return {
            width: INITIAL_COMPONENT_SETTINGS.TEXT.WIDTH,
            height: INITIAL_COMPONENT_SETTINGS.TEXT.HEIGHT,
            x: 0,
            y: 0,
            zIndex: 0,
          };
      }
    };

    const componentWithDefaults = {
      ...component,
      ...getInitialSettings(component.type),
    };

    onComponentSelect(componentWithDefaults);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium mb-2">컴포넌트</h3>
      <div className="grid grid-cols-3 gap-2">
        {AVAILABLE_COMPONENTS.map((component) => (
          <button
            key={component.id}
            className="p-2 text-sm border rounded hover:bg-gray-50"
            onClick={() => handleComponentSelect(component)}
          >
            {component.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComponentList;

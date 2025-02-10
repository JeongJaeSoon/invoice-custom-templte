import React from 'react';

export interface ComponentItem {
  id: string;
  name: string;
  type: 'title' | 'text' | 'table' | 'image' | 'signature' | 'qrcode';
}

interface ComponentListProps {
  onComponentSelect: (component: ComponentItem) => void;
}

const AVAILABLE_COMPONENTS: ComponentItem[] = [
  { id: 'title', name: '제목', type: 'title' },
  { id: 'text', name: '텍스트', type: 'text' },
  { id: 'table', name: '테이블', type: 'table' },
  { id: 'image', name: '이미지', type: 'image' },
  { id: 'signature', name: '서명', type: 'signature' },
  { id: 'qrcode', name: 'QR 코드', type: 'qrcode' },
];

const ComponentList: React.FC<ComponentListProps> = ({ onComponentSelect }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium mb-2">컴포넌트</h3>
      <div className="grid grid-cols-3 gap-2">
        {AVAILABLE_COMPONENTS.map((component) => (
          <button
            key={component.id}
            className="p-2 text-sm border rounded hover:bg-gray-50"
            onClick={() => onComponentSelect(component)}
          >
            {component.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComponentList;

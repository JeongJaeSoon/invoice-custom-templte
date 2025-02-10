import React from 'react';
import { ComponentItem } from './ComponentList';

interface CanvasComponent extends ComponentItem {
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

interface PropertyPanelProps {
  selectedComponent?: CanvasComponent;
  onPropertyChange?: (property: string, value: number) => void;
  onStyleChange?: (property: string, value: string | number) => void;
  onContentChange?: (property: string, value: string | number) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onPropertyChange,
  onStyleChange,
  onContentChange,
}) => {
  if (!selectedComponent) {
    return (
      <div className="flex-1 p-4 overflow-auto">
        <h3 className="text-sm font-medium mb-2">속성</h3>
        <div className="space-y-4">
          <div className="text-center text-gray-500">
            컴포넌트를 선택하여 속성을 편집하세요
          </div>
        </div>
      </div>
    );
  }

  const renderTypeSpecificProperties = () => {
    switch (selectedComponent.type) {
      case 'title':
      case 'text':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              텍스트
              <input
                type="text"
                value={selectedComponent.content?.text || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => onContentChange?.('text', e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              글자 크기
              <input
                type="number"
                value={selectedComponent.style?.fontSize || 16}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => onStyleChange?.('fontSize', parseInt(e.target.value) || 16)}
              />
            </label>
            <label className="block text-sm font-medium">
              정렬
              <select
                value={selectedComponent.style?.textAlign || 'left'}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => onStyleChange?.('textAlign', e.target.value)}
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
              </select>
            </label>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              행 수
              <input
                type="number"
                value={selectedComponent.content?.rows || 2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => onContentChange?.('rows', parseInt(e.target.value) || 2)}
              />
            </label>
            <label className="block text-sm font-medium">
              열 수
              <input
                type="number"
                value={selectedComponent.content?.columns || 2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => onContentChange?.('columns', parseInt(e.target.value) || 2)}
              />
            </label>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              이미지 URL
              <input
                type="text"
                value={selectedComponent.content?.imageUrl || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => onContentChange?.('imageUrl', e.target.value)}
              />
            </label>
          </div>
        );

      case 'qrcode':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              QR 코드 데이터
              <input
                type="text"
                value={selectedComponent.content?.qrData || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => onContentChange?.('qrData', e.target.value)}
              />
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <h3 className="text-sm font-medium mb-4">속성 - {selectedComponent.name}</h3>
      <div className="space-y-4">
        {/* 기본 속성 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            위치 X
            <input
              type="number"
              value={selectedComponent.x}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => onPropertyChange?.('x', parseInt(e.target.value) || 0)}
            />
          </label>
          <label className="block text-sm font-medium">
            위치 Y
            <input
              type="number"
              value={selectedComponent.y}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => onPropertyChange?.('y', parseInt(e.target.value) || 0)}
            />
          </label>
          <label className="block text-sm font-medium">
            너비
            <input
              type="number"
              value={selectedComponent.width}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => onPropertyChange?.('width', parseInt(e.target.value) || 0)}
            />
          </label>
          <label className="block text-sm font-medium">
            높이
            <input
              type="number"
              value={selectedComponent.height}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => onPropertyChange?.('height', parseInt(e.target.value) || 0)}
            />
          </label>
        </div>

        {/* 컴포넌트별 속성 */}
        {renderTypeSpecificProperties()}
      </div>
    </div>
  );
};

export default PropertyPanel;

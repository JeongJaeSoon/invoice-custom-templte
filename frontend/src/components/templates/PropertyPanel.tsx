import React from 'react';
import { CanvasComponent } from '../../types/CanvasComponent';

interface PropertyPanelProps {
  component: CanvasComponent;
  onPropertyChange: (property: string, value: number) => void;
  onStyleChange: (property: string, value: string | number) => void;
  onContentChange: (property: string, value: string | number) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  component,
  onPropertyChange,
  onStyleChange,
  onContentChange,
}) => {
  if (!component) return null;

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-sm font-medium mb-4">속성</h3>

      {/* 위치 및 크기 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            위치
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500">X</label>
              <input
                type="number"
                value={component.x}
                onChange={(e) =>
                  onPropertyChange('x', parseInt(e.target.value) || 0)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Y</label>
              <input
                type="number"
                value={component.y}
                onChange={(e) =>
                  onPropertyChange('y', parseInt(e.target.value) || 0)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            크기
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500">너비</label>
              <input
                type="number"
                value={component.width}
                onChange={(e) =>
                  onPropertyChange('width', parseInt(e.target.value) || 0)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">높이</label>
              <input
                type="number"
                value={component.height}
                onChange={(e) =>
                  onPropertyChange('height', parseInt(e.target.value) || 0)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* 스타일 설정 */}
        {component.type === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                텍스트 스타일
              </label>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500">글자 크기</label>
                  <input
                    type="number"
                    value={component.style?.fontSize || 16}
                    onChange={(e) =>
                      onStyleChange('fontSize', parseInt(e.target.value) || 16)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">정렬</label>
                  <select
                    value={component.style?.textAlign || 'left'}
                    onChange={(e) => onStyleChange('textAlign', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  >
                    <option value="left">왼쪽</option>
                    <option value="center">가운데</option>
                    <option value="right">오른쪽</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500">색상</label>
                  <input
                    type="color"
                    value={component.style?.color || '#000000'}
                    onChange={(e) => onStyleChange('color', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 컴포넌트별 특수 설정 */}
        {component.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              텍스트 내용
            </label>
            <textarea
              value={component.content?.text || ''}
              onChange={(e) => onContentChange('text', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
        )}

        {component.type === 'table' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                테이블 설정
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500">행</label>
                  <input
                    type="number"
                    value={component.content?.rows || 2}
                    onChange={(e) =>
                      onContentChange('rows', parseInt(e.target.value) || 2)
                    }
                    min={1}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">열</label>
                  <input
                    type="number"
                    value={component.content?.columns || 2}
                    onChange={(e) =>
                      onContentChange('columns', parseInt(e.target.value) || 2)
                    }
                    min={1}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {(component.type === 'image' || component.type === 'signature') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지 URL
            </label>
            <input
              type="text"
              value={component.content?.imageUrl || ''}
              onChange={(e) => onContentChange('imageUrl', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {component.type === 'qrcode' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              QR 코드 데이터
            </label>
            <input
              type="text"
              value={component.content?.qrData || ''}
              onChange={(e) => onContentChange('qrData', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;

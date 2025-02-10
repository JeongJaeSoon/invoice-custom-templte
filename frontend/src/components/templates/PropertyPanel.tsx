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
    <div className="p-4 border-b border-gray-200 property-panel">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                텍스트 스타일
              </label>
              <div className="space-y-3">
                {/* 글자 크기와 굵기를 한 행에 배치 */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">글자 크기</label>
                    <input
                      type="number"
                      value={component.style?.fontSize || 16}
                      onChange={(e) =>
                        onStyleChange('fontSize', parseInt(e.target.value) || 16)
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">글꼴 굵기</label>
                    <select
                      value={component.style?.fontWeight || 'normal'}
                      onChange={(e) => onStyleChange('fontWeight', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md"
                    >
                      <option value="100">Thin (100)</option>
                      <option value="200">Extra Light (200)</option>
                      <option value="300">Light (300)</option>
                      <option value="normal">Normal (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semi Bold (600)</option>
                      <option value="bold">Bold (700)</option>
                      <option value="800">Extra Bold (800)</option>
                    </select>
                  </div>
                </div>
                
                {/* 정렬과 색상을 한 행에 배치 */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">정렬</label>
                    <select
                      value={component.style?.textAlign || 'left'}
                      onChange={(e) => onStyleChange('textAlign', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md"
                    >
                      <option value="left">왼쪽</option>
                      <option value="center">가운데</option>
                      <option value="right">오른쪽</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">색상</label>
                    <input
                      type="color"
                      value={component.style?.color || '#000000'}
                      onChange={(e) => onStyleChange('color', e.target.value)}
                      className="w-full h-[34px] px-1 py-0.5 border border-gray-300 rounded-md"
                    />
                  </div>
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 URL
              </label>
              <input
                type="text"
                value={component.content?.imageUrl || ''}
                onChange={(e) => onContentChange('imageUrl', e.target.value)}
                placeholder="이미지 URL을 입력하세요"
                className="w-full px-2 py-1 border border-gray-300 rounded-md mb-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지 업로드
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      onContentChange('imageUrl', event.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            {component.content?.imageUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  미리보기
                </label>
                <div className="border border-gray-300 rounded-md p-2">
                  <img
                    src={component.content.imageUrl}
                    alt="미리보기"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            )}
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

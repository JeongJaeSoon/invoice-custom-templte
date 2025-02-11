import React from 'react';
import { CanvasComponent, INITIAL_COMPONENT_SETTINGS, TableCellStyle } from '../../types/CanvasComponent';

interface PropertyPanelProps {
  component: CanvasComponent;
  onPropertyChange: (property: string, value: number) => void;
  onStyleChange: (property: string, value: string | number) => void;
  onContentChange: (property: string, value: string | number | Partial<CanvasComponent['content']>) => void;
  selectedTableCells?: string[];
  onTableCellStyleChange?: (cellIds: string[], style: Partial<TableCellStyle>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  component,
  onPropertyChange,
  onStyleChange,
  onContentChange,
  selectedTableCells = [],
  onTableCellStyleChange,
}) => {
  if (!component) return null;

  const handleTableCellStyleChange = (property: keyof TableCellStyle, value: string | number) => {
    if (!onTableCellStyleChange || selectedTableCells.length === 0) return;
    onTableCellStyleChange(selectedTableCells, { [property]: value });
  };

  const getCommonCellStyle = (): Partial<TableCellStyle> => {
    if (!component.content?.tableCellStyles || selectedTableCells.length === 0) {
      return INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE;
    }

    const styles = selectedTableCells.map(cellId => component.content?.tableCellStyles?.[cellId] || {});
    const commonStyle: Partial<TableCellStyle> = {};

    (Object.keys(INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE) as Array<keyof TableCellStyle>).forEach(key => {
      const firstValue = styles[0]?.[key];
      if (styles.every(style => style[key] === firstValue)) {
        commonStyle[key] = firstValue;
      }
    });

    return commonStyle;
  };

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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">글자 크기</label>
                    <input
                      type="number"
                      value={component.style?.fontSize || INITIAL_COMPONENT_SETTINGS.TEXT.STYLE.FONT_SIZE}
                      onChange={(e) =>
                        onStyleChange('fontSize', parseInt(e.target.value) || INITIAL_COMPONENT_SETTINGS.TEXT.STYLE.FONT_SIZE)
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">글꼴 굵기</label>
                    <select
                      value={component.style?.fontWeight || INITIAL_COMPONENT_SETTINGS.TEXT.STYLE.FONT_WEIGHT}
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

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">정렬</label>
                    <select
                      value={component.style?.textAlign || INITIAL_COMPONENT_SETTINGS.TEXT.STYLE.TEXT_ALIGN}
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
                      value={component.style?.color || INITIAL_COMPONENT_SETTINGS.TEXT.STYLE.COLOR}
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
                    value={component.content?.rows || INITIAL_COMPONENT_SETTINGS.TABLE.ROWS}
                    onChange={(e) => {
                      const newRows = Math.max(1, parseInt(e.target.value) || INITIAL_COMPONENT_SETTINGS.TABLE.ROWS);
                      const defaultRowSizes = INITIAL_COMPONENT_SETTINGS.TABLE.getDefaultRowSizes(newRows);

                      // 모든 content 변경사항을 한 번에 업데이트
                      const updatedContent: Partial<CanvasComponent['content']> = {
                        ...component.content,
                        rows: newRows,
                        rowSizes: defaultRowSizes,
                      };
                      onContentChange('', updatedContent);
                    }}
                    min={1}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">열</label>
                  <input
                    type="number"
                    value={component.content?.columns || INITIAL_COMPONENT_SETTINGS.TABLE.COLUMNS}
                    onChange={(e) => {
                      const newColumns = Math.max(1, parseInt(e.target.value) || INITIAL_COMPONENT_SETTINGS.TABLE.COLUMNS);
                      const defaultColumnSizes = INITIAL_COMPONENT_SETTINGS.TABLE.getDefaultColumnSizes(newColumns);

                      // 모든 content 변경사항을 한 번에 업데이트
                      const updatedContent: Partial<CanvasComponent['content']> = {
                        ...component.content,
                        columns: newColumns,
                        columnSizes: defaultColumnSizes,
                      };
                      onContentChange('', updatedContent);
                    }}
                    min={1}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                크기 비율 설정
              </label>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500">열 크기 비율 (%, 쉼표로 구분)</label>
                  <input
                    type="text"
                    value={component.content?.columnSizes || INITIAL_COMPONENT_SETTINGS.TABLE.getDefaultColumnSizes(component.content?.columns || INITIAL_COMPONENT_SETTINGS.TABLE.COLUMNS)}
                    onChange={(e) => onContentChange('columnSizes', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">행 크기 비율 (%, 쉼표로 구분)</label>
                  <input
                    type="text"
                    value={component.content?.rowSizes || INITIAL_COMPONENT_SETTINGS.TABLE.getDefaultRowSizes(component.content?.rows || INITIAL_COMPONENT_SETTINGS.TABLE.ROWS)}
                    onChange={(e) => onContentChange('rowSizes', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {component.type === 'image' && (
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

        {component.type === 'table' && selectedTableCells.length > 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                선택된 셀 스타일 ({selectedTableCells.length}개 선택됨)
              </label>
              <div className="space-y-4">
                {/* 테두리 설정 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">테두리</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500">상단</label>
                      <input
                        type="text"
                        value={getCommonCellStyle().borderTop || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderTop}
                        onChange={(e) => handleTableCellStyleChange('borderTop', e.target.value)}
                        placeholder={INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderTop}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">우측</label>
                      <input
                        type="text"
                        value={getCommonCellStyle().borderRight || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderRight}
                        onChange={(e) => handleTableCellStyleChange('borderRight', e.target.value)}
                        placeholder={INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderRight}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">하단</label>
                      <input
                        type="text"
                        value={getCommonCellStyle().borderBottom || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderBottom}
                        onChange={(e) => handleTableCellStyleChange('borderBottom', e.target.value)}
                        placeholder={INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderBottom}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">좌측</label>
                      <input
                        type="text"
                        value={getCommonCellStyle().borderLeft || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderLeft}
                        onChange={(e) => handleTableCellStyleChange('borderLeft', e.target.value)}
                        placeholder={INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderLeft}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* 배경색 */}
                <div>
                  <label className="block text-xs text-gray-500">배경색</label>
                  <input
                    type="color"
                    value={getCommonCellStyle().backgroundColor || '#ffffff'}
                    onChange={(e) => handleTableCellStyleChange('backgroundColor', e.target.value)}
                    className="w-full h-[34px] px-1 py-0.5 border border-gray-300 rounded-md"
                  />
                </div>

                {/* 텍스트 스타일 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">텍스트 스타일</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500">글자 크기</label>
                      <input
                        type="number"
                        value={getCommonCellStyle().fontSize || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.fontSize}
                        onChange={(e) => handleTableCellStyleChange('fontSize', parseInt(e.target.value) || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.fontSize)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">글자 색상</label>
                      <input
                        type="color"
                        value={getCommonCellStyle().color || '#000000'}
                        onChange={(e) => handleTableCellStyleChange('color', e.target.value)}
                        className="w-full h-[34px] px-1 py-0.5 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">글꼴 굵기</label>
                      <select
                        value={getCommonCellStyle().fontWeight || 'normal'}
                        onChange={(e) => handleTableCellStyleChange('fontWeight', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      >
                        <option value="normal">기본</option>
                        <option value="bold">굵게</option>
                        <option value="100">Thin (100)</option>
                        <option value="300">Light (300)</option>
                        <option value="500">Medium (500)</option>
                        <option value="700">Bold (700)</option>
                        <option value="900">Black (900)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">정렬</label>
                      <select
                        value={getCommonCellStyle().textAlign || 'left'}
                        onChange={(e) => handleTableCellStyleChange('textAlign', e.target.value as TableCellStyle['textAlign'])}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      >
                        <option value="left">왼쪽</option>
                        <option value="center">가운데</option>
                        <option value="right">오른쪽</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;

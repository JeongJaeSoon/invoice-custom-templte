import React, { useState, useEffect } from 'react';
import { INITIAL_COMPONENT_SETTINGS, TableCellStyle } from '../../types/CanvasComponent';

interface TableComponentProps {
  data: { [key: string]: string };
  rows: number;
  columns: number;
  onDataChange: (data: { [key: string]: string }) => void;
  columnSizes?: string; // "30,40,30" 형식의 문자열 (%)
  rowSizes?: string; // "20,60,20" 형식의 문자열 (%)
  cellStyles?: { [key: string]: TableCellStyle };
  onCellStylesChange?: (styles: { [key: string]: TableCellStyle }) => void;
  onCellSelect?: (selectedCells: string[]) => void;
}

export const TableComponent: React.FC<TableComponentProps> = ({
  data,
  rows,
  columns,
  onDataChange,
  columnSizes,
  rowSizes,
  cellStyles = {},
  onCellSelect,
}) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [editValue, setEditValue] = useState<string>('');
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 컬럼 사이즈 계산
  const getColumnSizes = () => {
    if (!columnSizes) {
      return Array(columns).fill(`${Math.floor(100 / columns)}%`);
    }

    const sizes = columnSizes.split(',').map(size => Math.floor(parseFloat(size.trim())) || 0);
    if (sizes.length === 0) {
      return Array(columns).fill(`${Math.floor(100 / columns)}%`);
    }

    // 부족한 경우 나머지 공간을 균등 분배
    if (sizes.length < columns) {
      const usedSpace = sizes.reduce((sum, size) => sum + size, 0);
      const remainingSpace = Math.max(0, 100 - usedSpace);
      const remainingColumns = columns - sizes.length;
      const defaultSize = Math.floor(remainingSpace / remainingColumns);
      sizes.push(...Array(remainingColumns).fill(defaultSize));
    }
    // 넘치는 경우 초과분 제거 및 100%로 정규화
    else if (sizes.length > columns) {
      sizes.splice(columns);
    }

    // 합이 100%가 되도록 정규화
    const total = sizes.reduce((sum, size) => sum + size, 0);
    const normalizedSizes = sizes.map((size, index) => {
      if (index === sizes.length - 1) {
        // 마지막 열은 나머지 값을 할당하여 합이 정확히 100이 되도록 함
        const sumOthers = sizes.slice(0, -1).reduce((sum, s) => sum + Math.floor((s / total) * 100), 0);
        return 100 - sumOthers;
      }
      return Math.floor((size / total) * 100);
    });

    return normalizedSizes.map(size => `${size}%`);
  };

  // 행 사이즈 계산
  const getRowSizes = () => {
    if (!rowSizes) {
      return Array(rows).fill(`${Math.floor(100 / rows)}%`);
    }

    const sizes = rowSizes.split(',').map(size => Math.floor(parseFloat(size.trim())) || 0);
    if (sizes.length === 0) {
      return Array(rows).fill(`${Math.floor(100 / rows)}%`);
    }

    // 부족한 경우 나머지 공간을 균등 분배
    if (sizes.length < rows) {
      const usedSpace = sizes.reduce((sum, size) => sum + size, 0);
      const remainingSpace = Math.max(0, 100 - usedSpace);
      const remainingRows = rows - sizes.length;
      const defaultSize = Math.floor(remainingSpace / remainingRows);
      sizes.push(...Array(remainingRows).fill(defaultSize));
    }
    // 넘치는 경우 초과분 제거 및 100%로 정규화
    else if (sizes.length > rows) {
      sizes.splice(rows);
    }

    // 합이 100%가 되도록 정규화
    const total = sizes.reduce((sum, size) => sum + size, 0);
    const normalizedSizes = sizes.map((size, index) => {
      if (index === sizes.length - 1) {
        // 마지막 행은 나머지 값을 할당하여 합이 정확히 100이 되도록 함
        const sumOthers = sizes.slice(0, -1).reduce((sum, s) => sum + Math.floor((s / total) * 100), 0);
        return 100 - sumOthers;
      }
      return Math.floor((size / total) * 100);
    });

    return normalizedSizes.map(size => `${size}%`);
  };

  const handleCellClick = (cellId: string) => {
    if (isShiftPressed) {
      const newSelectedCells = selectedCells.includes(cellId)
        ? selectedCells.filter(id => id !== cellId)
        : [...selectedCells, cellId];
      setSelectedCells(newSelectedCells);
      onCellSelect?.(newSelectedCells);
    } else {
      setSelectedCell(cellId);
      setSelectedCells([cellId]);
      setEditValue(data[cellId] || '');
      onCellSelect?.([cellId]);
    }
  };

  const handleCellBlur = () => {
    if (selectedCell && editValue !== data[selectedCell]) {
      const newData = { ...data, [selectedCell]: editValue };
      onDataChange(newData);
    }
    setSelectedCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    }
  };

  const columnWidths = getColumnSizes();
  const rowHeights = getRowSizes();

  return (
    <div className="w-full h-full">
      <table className="w-full h-full border-collapse">
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} style={{ height: rowHeights[rowIndex] }}>
              {Array.from({ length: columns }).map((_, colIndex) => {
                const cellId = `${rowIndex}-${colIndex}`;
                const cellStyle = cellStyles[cellId] || {};
                const isSelected = selectedCells.includes(cellId);

                return (
                  <td
                    key={cellId}
                    className={`p-1 min-w-[50px] h-[30px] relative`}
                    style={{
                      width: columnWidths[colIndex],
                      borderTop: cellStyle.borderTop || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderTop,
                      borderRight: cellStyle.borderRight || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderRight,
                      borderBottom: cellStyle.borderBottom || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderBottom,
                      borderLeft: cellStyle.borderLeft || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.borderLeft,
                      backgroundColor: cellStyle.backgroundColor || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.backgroundColor,
                      color: cellStyle.color || INITIAL_COMPONENT_SETTINGS.TABLE.DEFAULT_CELL_STYLE.color,
                      fontSize: cellStyle.fontSize ? `${cellStyle.fontSize}px` : undefined,
                      fontWeight: cellStyle.fontWeight,
                      textAlign: cellStyle.textAlign,
                    }}
                    onClick={() => handleCellClick(cellId)}
                  >
                    {isSelected && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          border: '2px solid rgb(59, 130, 246)',
                          zIndex: 10,
                        }}
                      />
                    )}
                    {selectedCell === cellId ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full outline-none bg-transparent relative z-20"
                        style={{
                          color: 'inherit',
                          fontSize: 'inherit',
                          fontWeight: 'inherit',
                          textAlign: (cellStyle.textAlign || 'left'),
                        }}
                        autoFocus
                      />
                    ) : (
                      <div className="w-full h-full relative z-20">{data[cellId] || ''}</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 

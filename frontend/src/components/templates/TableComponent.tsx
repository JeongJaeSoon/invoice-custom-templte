import React, { useState } from 'react';

interface TableComponentProps {
  data: { [key: string]: string };
  rows: number;
  columns: number;
  onDataChange: (data: { [key: string]: string }) => void;
  columnSizes?: string; // "30,40,30" 형식의 문자열 (%)
  rowSizes?: string; // "20,60,20" 형식의 문자열 (%)
}

export const TableComponent: React.FC<TableComponentProps> = ({
  data,
  rows,
  columns,
  onDataChange,
  columnSizes,
  rowSizes,
}) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // 컬럼 사이즈 계산
  const getColumnSizes = () => {
    if (!columnSizes) {
      return Array(columns).fill(`${(100 / columns).toFixed(2)}%`);
    }

    const sizes = columnSizes.split(',').map(size => parseFloat(size.trim()) || 0);
    if (sizes.length === 0) {
      return Array(columns).fill(`${(100 / columns).toFixed(2)}%`);
    }

    // 부족한 경우 나머지 공간을 균등 분배
    if (sizes.length < columns) {
      const usedSpace = sizes.reduce((sum, size) => sum + size, 0);
      const remainingSpace = Math.max(0, 100 - usedSpace);
      const remainingColumns = columns - sizes.length;
      const defaultSize = remainingSpace / remainingColumns;
      sizes.push(...Array(remainingColumns).fill(defaultSize));
    }
    // 넘치는 경우 초과분 제거 및 100%로 정규화
    else if (sizes.length > columns) {
      sizes.splice(columns);
    }

    // 합이 100%가 되도록 정규화
    const total = sizes.reduce((sum, size) => sum + size, 0);
    const normalizedSizes = sizes.map(size => (size / total * 100).toFixed(2));

    return normalizedSizes.map(size => `${size}%`);
  };

  // 행 사이즈 계산
  const getRowSizes = () => {
    if (!rowSizes) {
      return Array(rows).fill(`${(100 / rows).toFixed(2)}%`);
    }

    const sizes = rowSizes.split(',').map(size => parseFloat(size.trim()) || 0);
    if (sizes.length === 0) {
      return Array(rows).fill(`${(100 / rows).toFixed(2)}%`);
    }

    // 부족한 경우 나머지 공간을 균등 분배
    if (sizes.length < rows) {
      const usedSpace = sizes.reduce((sum, size) => sum + size, 0);
      const remainingSpace = Math.max(0, 100 - usedSpace);
      const remainingRows = rows - sizes.length;
      const defaultSize = remainingSpace / remainingRows;
      sizes.push(...Array(remainingRows).fill(defaultSize));
    }
    // 넘치는 경우 초과분 제거 및 100%로 정규화
    else if (sizes.length > rows) {
      sizes.splice(rows);
    }

    // 합이 100%가 되도록 정규화
    const total = sizes.reduce((sum, size) => sum + size, 0);
    const normalizedSizes = sizes.map(size => (size / total * 100).toFixed(2));

    return normalizedSizes.map(size => `${size}%`);
  };

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    setEditValue(data[cellId] || '');
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
                return (
                  <td
                    key={cellId}
                    className="border border-gray-300 p-1 min-w-[50px] h-[30px]"
                    style={{ width: columnWidths[colIndex] }}
                    onClick={() => handleCellClick(cellId)}
                  >
                    {selectedCell === cellId ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full outline-none"
                        autoFocus
                      />
                    ) : (
                      <div className="w-full h-full">{data[cellId] || ''}</div>
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

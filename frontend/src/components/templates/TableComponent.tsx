import React, { useState } from 'react';

interface TableComponentProps {
  data: { [key: string]: string };
  rows: number;
  columns: number;
  onDataChange: (data: { [key: string]: string }) => void;
}

export const TableComponent: React.FC<TableComponentProps> = ({
  data,
  rows,
  columns,
  onDataChange,
}) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

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

  return (
    <div className="w-full h-full">
      <table className="w-full h-full border-collapse">
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => {
                const cellId = `${rowIndex}-${colIndex}`;
                return (
                  <td
                    key={cellId}
                    className="border border-gray-300 p-1 min-w-[50px] h-[30px]"
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

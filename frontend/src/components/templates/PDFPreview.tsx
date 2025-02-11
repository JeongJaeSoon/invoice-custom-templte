import React from 'react';
import PDFCanvas from './PDFCanvas'
import { CanvasComponent } from '../../types/CanvasComponent';

interface PDFPreviewProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentClick?: (component: CanvasComponent | null) => void;
  onComponentUpdate?: (componentId: string, updates: Partial<CanvasComponent>) => void;
  onTableCellSelect?: (cellIds: string[]) => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  components,
  selectedComponent,
  onComponentClick,
  onComponentUpdate,
  onTableCellSelect,
}) => {
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // 배경을 직접 클릭했을 때만 선택 해제
    if ((e.target as HTMLElement).parentElement === e.currentTarget && onComponentClick && selectedComponent) {
      onComponentClick(null);
    }
  };

  return (
    <div
      className="w-full h-full bg-gray-100 overflow-auto"
      onClick={handleBackgroundClick}
    >
      <PDFCanvas
        components={components}
        selectedComponent={selectedComponent}
        onComponentClick={onComponentClick}
        onComponentUpdate={onComponentUpdate}
        onTableCellSelect={onTableCellSelect}
      />
    </div>
  );
};

export default PDFPreview;

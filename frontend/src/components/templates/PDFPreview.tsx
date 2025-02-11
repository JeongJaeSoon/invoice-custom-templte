import React from 'react';
import PDFCanvas from './PDFCanvas'
import { CanvasComponent } from '../../types/CanvasComponent';

interface PDFPreviewProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentClick?: (component: CanvasComponent) => void;
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
  return (
    <div className="w-full h-full bg-gray-100 overflow-auto">
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

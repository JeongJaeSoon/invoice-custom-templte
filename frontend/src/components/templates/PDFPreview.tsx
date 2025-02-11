import React from 'react';
import PDFCanvas from './PDFCanvas'
import { CanvasComponent } from '../../types/CanvasComponent';

interface PDFPreviewProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentClick?: (component: CanvasComponent) => void;
  onComponentUpdate?: (componentId: string, updates: Partial<CanvasComponent>) => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  components,
  selectedComponent,
  onComponentClick,
  onComponentUpdate,
}) => {
  return (
    <div className="w-full bg-gray-100 overflow-auto">
      <div>
        <PDFCanvas
          components={components}
          selectedComponent={selectedComponent}
          onComponentClick={onComponentClick}
          onComponentUpdate={onComponentUpdate}
        />
      </div>
    </div>
  );
};

export default PDFPreview;

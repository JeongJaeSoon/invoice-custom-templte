import React from 'react';
import PDFCanvas from './PDFCanvas';
import { ComponentItem } from './ComponentList';

interface CanvasComponent extends ComponentItem {
  x: number;
  y: number;
  width: number;
  height: number;
}

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
    <div className="w-full bg-gray-100 p-4 overflow-auto">
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

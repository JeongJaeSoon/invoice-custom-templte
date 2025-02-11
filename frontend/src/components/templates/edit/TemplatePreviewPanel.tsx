import React from 'react';
import PDFPreview from '../PDFPreview';
import { CanvasComponent } from '../../../types/CanvasComponent';

interface TemplatePreviewPanelProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentClick: (component: CanvasComponent) => void;
  onComponentUpdate: (componentId: string, updates: Partial<CanvasComponent>) => void;
  onTableCellSelect?: (cellIds: string[]) => void;
}

const TemplatePreviewPanel: React.FC<TemplatePreviewPanelProps> = ({
  components,
  selectedComponent,
  onComponentClick,
  onComponentUpdate,
  onTableCellSelect,
}) => {
  return (
    <div className="flex-1">
      <PDFPreview
        components={components}
        selectedComponent={selectedComponent}
        onComponentClick={(component) => onComponentClick(component as CanvasComponent)}
        onComponentUpdate={onComponentUpdate}
        onTableCellSelect={onTableCellSelect}
      />
    </div>
  );
};

export default TemplatePreviewPanel;

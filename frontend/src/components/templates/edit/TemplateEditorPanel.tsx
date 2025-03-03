import React from 'react';
import ComponentList from '../ComponentList';
import ComponentListPanel from '../ComponentListPanel';
import PropertyPanel from '../PropertyPanel';
import ComponentNameEditor from '../ComponentNameEditor';
import { CanvasComponent, ComponentItem, TableCellStyle } from '../../../types/CanvasComponent';

interface TemplateEditorPanelProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentSelect: (component: ComponentItem) => void;
  onComponentDelete: (componentId: string) => void;
  onPropertyChange: (property: string, value: number) => void;
  onStyleChange: (property: string, value: string | number) => void;
  onContentChange: (property: string, value: string | number | Partial<CanvasComponent['content']>) => void;
  onCanvasComponentClick: (component: CanvasComponent) => void;
  onNameChange: (name: string) => void;
  onComponentsReorder: (components: CanvasComponent[]) => void;
  selectedTableCells?: string[];
  onTableCellStyleChange?: (cellIds: string[], style: Partial<TableCellStyle>) => void;
}

const TemplateEditorPanel: React.FC<TemplateEditorPanelProps> = ({
  components,
  selectedComponent,
  onComponentSelect,
  onComponentDelete,
  onPropertyChange,
  onStyleChange,
  onContentChange,
  onCanvasComponentClick,
  onNameChange,
  onComponentsReorder,
  selectedTableCells,
  onTableCellStyleChange,
}) => {
  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      <ComponentList onComponentSelect={onComponentSelect} />
      <ComponentListPanel
        components={components}
        selectedComponent={selectedComponent}
        onComponentSelect={onCanvasComponentClick}
        onComponentDelete={onComponentDelete}
        onComponentsReorder={onComponentsReorder}
      />
      {selectedComponent && (
        <>
          <ComponentNameEditor
            name={selectedComponent.name}
            onNameChange={onNameChange}
          />
          <PropertyPanel
            component={selectedComponent}
            onPropertyChange={onPropertyChange}
            onStyleChange={onStyleChange}
            onContentChange={onContentChange}
            selectedTableCells={selectedTableCells}
            onTableCellStyleChange={onTableCellStyleChange}
          />
        </>
      )}
    </div>
  );
};

export default TemplateEditorPanel;

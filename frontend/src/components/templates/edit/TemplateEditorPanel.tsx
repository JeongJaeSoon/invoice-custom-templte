import React from 'react';
import ComponentList, { ComponentItem } from '../ComponentList';
import ComponentListPanel from '../ComponentListPanel';
import PropertyPanel from '../PropertyPanel';
import ComponentNameEditor from '../ComponentNameEditor';
import { CanvasComponent } from '../../../types/CanvasComponent';

interface TemplateEditorPanelProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentSelect: (component: ComponentItem) => void;
  onComponentDelete: (componentId: string) => void;
  onPropertyChange: (property: string, value: number) => void;
  onStyleChange: (property: string, value: string | number) => void;
  onContentChange: (property: string, value: string | number) => void;
  onCanvasComponentClick: (component: CanvasComponent) => void;
  onNameChange: (name: string) => void;
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
}) => {
  return (
    <div className="w-1/2 h-full border-l border-gray-200">
      <div className="h-full flex flex-col">
        {/* 상단 도구 모음 */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">템플릿 편집</h2>
        </div>

        {/* 컴포넌트 목록 */}
        <ComponentList onComponentSelect={onComponentSelect} />

        {/* 추가된 컴포넌트 목록 */}
        <ComponentListPanel
          components={components}
          selectedComponent={selectedComponent}
          onComponentSelect={onCanvasComponentClick}
          onComponentDelete={onComponentDelete}
        />

        {/* 별도의 컴포넌트 이름 편집 패널 */}
        <ComponentNameEditor
          selectedComponent={selectedComponent}
          onNameChange={onNameChange}
        />

        {/* 기존 속성 편집 패널 (컴포넌트 이름 관련 UI는 제거) */}
        <PropertyPanel
          selectedComponent={selectedComponent}
          onPropertyChange={onPropertyChange}
          onStyleChange={onStyleChange}
          onContentChange={onContentChange}
        />
      </div>
    </div>
  );
};

export default TemplateEditorPanel;

import { CanvasComponent, ComponentItem } from '../../types/CanvasComponent';
import TemplatePreviewPanel from '../../components/templates/edit/TemplatePreviewPanel';
import TemplateEditorPanel from '../../components/templates/edit/TemplateEditorPanel';
import DebugMenu from '../../components/templates/DebugMenu';
import { useTemplateStore } from '../../store/templateStore';

const TemplateEditPage = () => {
  const {
    components,
    selectedComponent,
    addComponent,
    updateComponent,
    selectComponent,
    deleteComponent,
    reorderComponents,
  } = useTemplateStore();

  const handleComponentSelect = (component: ComponentItem) => {
    addComponent(component);
  };

  const handleCanvasComponentClick = (component: CanvasComponent) => {
    selectComponent(component);
  };

  const handlePropertyChange = (property: string, value: number) => {
    if (!selectedComponent) return;
    updateComponent(selectedComponent.id, { [property]: value });
  };

  const handleStyleChange = (property: string, value: string | number) => {
    if (!selectedComponent) return;
    updateComponent(selectedComponent.id, {
      style: {
        ...selectedComponent.style,
        [property]: value,
      },
    });
  };

  const handleContentChange = (property: string, value: string | number | Partial<CanvasComponent['content']>) => {
    if (!selectedComponent) return;

    // property가 비어있으면 value를 전체 content로 사용
    const updatedContent = property === ''
      ? value as CanvasComponent['content']
      : {
          ...selectedComponent.content,
          [property]: value,
        };

    updateComponent(selectedComponent.id, {
      content: updatedContent,
    });
  };

  const handleNameChange = (name: string) => {
    if (!selectedComponent) return;
    updateComponent(selectedComponent.id, { name });
  };

  return (
    <div className="relative w-full h-full">
      <div className="flex w-full h-full">
        {/* 미리보기 패널 */}
        <TemplatePreviewPanel
          components={components}
          selectedComponent={selectedComponent}
          onComponentClick={handleCanvasComponentClick}
          onComponentUpdate={updateComponent}
        />

        {/* 편집 패널 */}
        <TemplateEditorPanel
          components={components}
          selectedComponent={selectedComponent}
          onComponentSelect={handleComponentSelect}
          onComponentDelete={deleteComponent}
          onPropertyChange={handlePropertyChange}
          onStyleChange={handleStyleChange}
          onContentChange={handleContentChange}
          onCanvasComponentClick={handleCanvasComponentClick}
          onNameChange={handleNameChange}
          onComponentsReorder={reorderComponents}
        />
      </div>

      {/* 디버그 메뉴 */}
      <DebugMenu />
    </div>
  );
};

export default TemplateEditPage;

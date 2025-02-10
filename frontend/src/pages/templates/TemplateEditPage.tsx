import { useState } from 'react';
import { ComponentItem } from '../../components/templates/ComponentList';
import { CanvasComponent } from '../../types/CanvasComponent';
import TemplatePreviewPanel from '../../components/templates/edit/TemplatePreviewPanel';
import TemplateEditorPanel from '../../components/templates/edit/TemplateEditorPanel';
import { v4 as uuidv4 } from 'uuid';


const TemplateEditPage = () => {
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<CanvasComponent>();

  const handleComponentSelect = (component: ComponentItem) => {
    const newComponent: CanvasComponent = {
      ...component,
      id: uuidv4(),
      name: `컴포넌트_${components.length + 1}`,
      x: 0,
      y: 0,
      width: 200,
      height: 100,
      zIndex: components.length + 1,
    };
    setComponents((prev) => [...prev, newComponent]);
    setSelectedComponent(newComponent);
  };

  const handleCanvasComponentClick = (component: CanvasComponent) => {
    setSelectedComponent(component);
  };

  const handleComponentUpdate = (componentId: string, updates: Partial<CanvasComponent>) => {
    const updatedComponents = components.map(comp => {
      if (comp.id === componentId) {
        return {
          ...comp,
          ...updates,
        };
      }
      return comp;
    });

    const updatedComponent = updatedComponents.find(
      comp => comp.id === componentId
    );

    setComponents(updatedComponents);
    if (updatedComponent) {
      setSelectedComponent(updatedComponent);
    }
  };

  const handlePropertyChange = (property: string, value: number) => {
    if (!selectedComponent) return;
    handleComponentUpdate(selectedComponent.id, { [property]: value });
  };

  const handleStyleChange = (property: string, value: string | number) => {
    if (!selectedComponent) return;
    handleComponentUpdate(selectedComponent.id, {
      style: {
        ...selectedComponent.style,
        [property]: value,
      },
    });
  };

  const handleContentChange = (property: string, value: string | number) => {
    if (!selectedComponent) return;
    handleComponentUpdate(selectedComponent.id, {
      content: {
        ...selectedComponent.content,
        [property]: value,
      },
    });
  };

  const handleNameChange = (name: string) => {
    if (!selectedComponent) return;
    handleComponentUpdate(selectedComponent.id, { name });
  };

  const handleComponentDelete = (componentId: string) => {
    const updatedComponents = components.filter(comp => comp.id !== componentId);
    setComponents(updatedComponents);
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(undefined);
    }
  };

  const handleComponentsReorder = (reorderedComponents: CanvasComponent[]) => {
    const updatedComponents = reorderedComponents.map((component, index) => ({
      ...component,
      zIndex: reorderedComponents.length - index,
    }));
    setComponents(updatedComponents);
  };

  return (
    <div className="flex">
      {/* 미리보기 패널 */}
      <TemplatePreviewPanel
        components={components}
        selectedComponent={selectedComponent}
        onComponentClick={handleCanvasComponentClick}
        onComponentUpdate={handleComponentUpdate}
      />

      {/* 편집 패널 */}
      <TemplateEditorPanel
        components={components}
        selectedComponent={selectedComponent}
        onComponentSelect={handleComponentSelect}
        onComponentDelete={handleComponentDelete}
        onPropertyChange={handlePropertyChange}
        onStyleChange={handleStyleChange}
        onContentChange={handleContentChange}
        onCanvasComponentClick={handleCanvasComponentClick}
        onNameChange={handleNameChange}
        onComponentsReorder={handleComponentsReorder}
      />
    </div>
  );
};

export default TemplateEditPage;

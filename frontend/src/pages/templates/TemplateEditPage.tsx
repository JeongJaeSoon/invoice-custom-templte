import { useState } from 'react';
import { ComponentItem } from '../../components/templates/ComponentList';
import { CanvasComponent } from '../../types/CanvasComponent';
import TemplatePreviewPanel from '../../components/templates/edit/TemplatePreviewPanel';
import TemplateEditorPanel from '../../components/templates/edit/TemplateEditorPanel';

// 기본 컴포넌트 크기 설정
const DEFAULT_COMPONENT_SIZE = {
  width: 200,
  height: 50,
};

// 고유 ID 생성 함수
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const TemplateEditPage = () => {
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<CanvasComponent>();

  const handleComponentSelect = (component: ComponentItem) => {
    // 새 컴포넌트를 캔버스 중앙에 추가
    const newComponent: CanvasComponent = {
      ...component,
      id: generateUniqueId(), // 고유 ID 생성
      x: 100,
      y: 100,
      width: DEFAULT_COMPONENT_SIZE.width,
      height: DEFAULT_COMPONENT_SIZE.height,
      style: {
        fontSize: 16,
        textAlign: 'left',
      },
      content: {
        text: `새로운 ${component.name}`, // 기본 텍스트에 컴포넌트 이름 추가
      },
    };

    setComponents([...components, newComponent]);
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

  return (
    <div className="flex h-screen">
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
      />
    </div>
  );
};

export default TemplateEditPage;

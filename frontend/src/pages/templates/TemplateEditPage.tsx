import { useState } from 'react';
import PDFPreview from '../../components/templates/PDFPreview';
import ComponentList, { ComponentItem } from '../../components/templates/ComponentList';
import PropertyPanel from '../../components/templates/PropertyPanel';
import ComponentListPanel from '../../components/templates/ComponentListPanel';

// 기본 컴포넌트 크기 설정
const DEFAULT_COMPONENT_SIZE = {
  width: 200,
  height: 50,
};

interface CanvasComponent extends ComponentItem {
  x: number;
  y: number;
  width: number;
  height: number;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
  };
  content?: {
    text?: string;
    rows?: number;
    columns?: number;
    imageUrl?: string;
    qrData?: string;
  };
}

const TemplateEditPage = () => {
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<CanvasComponent>();

  const handleComponentSelect = (component: ComponentItem) => {
    // 새 컴포넌트를 캔버스 중앙에 추가
    const newComponent: CanvasComponent = {
      ...component,
      x: 100,
      y: 100,
      width: DEFAULT_COMPONENT_SIZE.width,
      height: DEFAULT_COMPONENT_SIZE.height,
      style: {
        fontSize: 16,
        textAlign: 'left',
      },
      content: {},
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

  const handleComponentDelete = (componentId: string) => {
    const updatedComponents = components.filter(comp => comp.id !== componentId);
    setComponents(updatedComponents);
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(undefined);
    }
  };

  return (
    <div className="flex h-screen">
      {/* 좌측: PDF 미리보기 영역 */}
      <PDFPreview
        components={components}
        selectedComponent={selectedComponent}
        onComponentClick={handleCanvasComponentClick}
        onComponentUpdate={handleComponentUpdate}
      />

      {/* 우측: 편집 패널 */}
      <div className="w-1/2 h-full border-l border-gray-200">
        <div className="h-full flex flex-col">
          {/* 상단 도구 모음 */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">템플릿 편집</h2>
          </div>

          {/* 컴포넌트 목록 */}
          <ComponentList onComponentSelect={handleComponentSelect} />

          {/* 추가된 컴포넌트 목록 */}
          <ComponentListPanel
            components={components}
            selectedComponent={selectedComponent}
            onComponentSelect={handleCanvasComponentClick}
            onComponentDelete={handleComponentDelete}
          />

          {/* 속성 편집 패널 */}
          <PropertyPanel
            selectedComponent={selectedComponent}
            onPropertyChange={handlePropertyChange}
            onStyleChange={handleStyleChange}
            onContentChange={handleContentChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateEditPage;

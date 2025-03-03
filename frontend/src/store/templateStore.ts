import { create } from 'zustand';
import { CanvasComponent, INITIAL_COMPONENT_SETTINGS, ComponentItem } from '../types/CanvasComponent';
import { v4 as uuidv4 } from 'uuid';

interface TemplateState {
  components: CanvasComponent[];
  selectedComponent: CanvasComponent | undefined;
  addComponent: (component: ComponentItem) => void;
  updateComponent: (componentId: string, updates: Partial<CanvasComponent>) => void;
  selectComponent: (component: CanvasComponent | undefined) => void;
  deleteComponent: (componentId: string) => void;
  reorderComponents: (reorderedComponents: CanvasComponent[]) => void;
  getTemplateJson: () => object;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  components: [],
  selectedComponent: undefined,

  addComponent: (component: ComponentItem) => {
    const getComponentTypeName = (type: string) => {
      switch (type) {
        case 'text':
          return '텍스트';
        case 'table':
          return '테이블';
        case 'image':
          return '이미지';
        default:
          return '컴포넌트';
      }
    };

    const typeName = getComponentTypeName(component.type);
    const typeCount = get().components.filter(c => c.type === component.type).length + 1;

    const getInitialSettings = (type: string) => {
      switch (type) {
        case 'text':
          return {
            width: INITIAL_COMPONENT_SETTINGS.TEXT.WIDTH,
            height: INITIAL_COMPONENT_SETTINGS.TEXT.HEIGHT,
            style: {
              fontSize: INITIAL_COMPONENT_SETTINGS.TEXT.STYLE.FONT_SIZE,
              fontWeight: INITIAL_COMPONENT_SETTINGS.TEXT.STYLE.FONT_WEIGHT,
              textAlign: INITIAL_COMPONENT_SETTINGS.TEXT.STYLE.TEXT_ALIGN,
              color: INITIAL_COMPONENT_SETTINGS.TEXT.STYLE.COLOR,
            },
          };
        case 'table':
          return {
            width: INITIAL_COMPONENT_SETTINGS.TABLE.WIDTH,
            height: INITIAL_COMPONENT_SETTINGS.TABLE.HEIGHT,
            content: {
              rows: INITIAL_COMPONENT_SETTINGS.TABLE.ROWS,
              columns: INITIAL_COMPONENT_SETTINGS.TABLE.COLUMNS,
              tableData: {},
            },
          };
        case 'image':
          return {
            width: INITIAL_COMPONENT_SETTINGS.IMAGE.WIDTH,
            height: INITIAL_COMPONENT_SETTINGS.IMAGE.HEIGHT,
          };
        default:
          return {
            width: INITIAL_COMPONENT_SETTINGS.TEXT.WIDTH,
            height: INITIAL_COMPONENT_SETTINGS.TEXT.HEIGHT,
          };
      }
    };

    const newComponent: CanvasComponent = {
      ...component,
      ...getInitialSettings(component.type),
      id: uuidv4(),
      name: `${typeName}_${typeCount}`,
      x: 0,
      y: 0,
      zIndex: get().components.length + 1,
    };
    set((state) => ({
      components: [...state.components, newComponent],
      selectedComponent: newComponent,
    }));
  },

  updateComponent: (componentId: string, updates: Partial<CanvasComponent>) => {
    set((state) => {
      const updatedComponents = state.components.map((comp) =>
        comp.id === componentId ? { ...comp, ...updates } : comp
      );
      const updatedComponent = updatedComponents.find((comp) => comp.id === componentId);
      return {
        components: updatedComponents,
        selectedComponent: updatedComponent,
      };
    });
  },

  selectComponent: (component) => {
    set({ selectedComponent: component });
  },

  deleteComponent: (componentId: string) => {
    set((state) => ({
      components: state.components.filter((comp) => comp.id !== componentId),
      selectedComponent:
        state.selectedComponent?.id === componentId ? undefined : state.selectedComponent,
    }));
  },

  reorderComponents: (reorderedComponents: CanvasComponent[]) => {
    const updatedComponents = reorderedComponents.map((component, index) => ({
      ...component,
      zIndex: reorderedComponents.length - index,
    }));
    set({ components: updatedComponents });
  },

  getTemplateJson: () => {
    const { components } = get();
    return {
      version: "1.0",
      components: components.map(({ id, name, type, x, y, width, height, zIndex, style, content }) => ({
        id,
        name,
        type,
        x,
        y,
        width,
        height,
        zIndex,
        style,
        content,
      })),
    };
  },
}));

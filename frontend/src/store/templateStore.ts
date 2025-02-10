import { create } from 'zustand';
import { CanvasComponent } from '../types/CanvasComponent';
import { v4 as uuidv4 } from 'uuid';
import { ComponentItem } from '../components/templates/ComponentList';

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
    const newComponent: CanvasComponent = {
      ...component,
      id: uuidv4(),
      name: `컴포넌트_${get().components.length + 1}`,
      x: 0,
      y: 0,
      width: 200,
      height: 100,
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

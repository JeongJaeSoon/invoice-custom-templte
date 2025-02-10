import React, { useRef, useEffect } from 'react';
import { ComponentItem } from './ComponentList';

interface CanvasComponent extends ComponentItem {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface ComponentListPanelProps {
  components: CanvasComponent[];
  selectedComponent?: CanvasComponent;
  onComponentSelect: (component: CanvasComponent) => void;
  onComponentDelete: (componentId: string) => void;
  onComponentsReorder: (components: CanvasComponent[]) => void;
}

const ComponentListPanel: React.FC<ComponentListPanelProps> = ({
  components,
  selectedComponent,
  onComponentSelect,
  onComponentDelete,
  onComponentsReorder,
}) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 컴포넌트 리스트 패널 영역 밖을 클릭했을 때만 처리
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // 클릭된 요소가 PDF 미리보기 영역 내부이거나 다른 UI 요소인 경우에도 선택 해제
        const isPropertyPanel = (event.target as Element)?.closest('.property-panel');
        const isComponentList = (event.target as Element)?.closest('.component-list');

        // PropertyPanel이나 ComponentList 영역이 아닌 곳을 클릭했을 때만 선택 해제
        if (!isPropertyPanel && !isComponentList) {
          onComponentSelect(null as unknown as CanvasComponent);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onComponentSelect]);

  const handleSelect = (component: CanvasComponent) => {
    onComponentSelect(component);
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= components.length) return;

    const newComponents = [...components];
    const [movedComponent] = newComponents.splice(index, 1);
    newComponents.splice(newIndex, 0, movedComponent);

    // z-index 재할당
    const updatedComponents = newComponents.map((item, idx) => ({
      ...item,
      zIndex: newComponents.length - idx, // 리스트의 첫 번째 항목이 가장 위에 오도록 zIndex 설정
    }));

    onComponentsReorder(updatedComponents);

    // 이동된 컴포넌트를 선택 상태로 만들고 스크롤
    requestAnimationFrame(() => {
      handleSelect(movedComponent);
      itemRefs.current[newIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    });
  };

  return (
    <div className="p-4 border-b border-gray-200" ref={containerRef}>
      <h3 className="text-sm font-medium mb-2">추가된 컴포넌트</h3>
      <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
        {[...components].reverse().map((component, index) => (
          <div
            key={component.id}
            ref={el => {
              itemRefs.current[components.length - 1 - index] = el;
              return undefined;
            }}
            className={`flex items-center justify-between p-2 rounded border transition-colors duration-200 ${
              selectedComponent?.id === component.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200 hover:bg-blue-50'
            }`}
            onClick={() => handleSelect(component)}
          >
            <div className="flex items-center space-x-2">
              <div className="flex flex-col space-y-1">
                <button
                  className={`p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors duration-200`}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveComponent(components.length - 1 - index, 'down');
                  }}
                  disabled={index === 0}
                  title="위로 이동"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  className={`p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors duration-200`}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveComponent(components.length - 1 - index, 'up');
                  }}
                  disabled={index === components.length - 1}
                  title="아래로 이동"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <p className="text-sm font-medium">{component.name}</p>
                <p className="text-xs text-gray-500">ID: {component.id}</p>
              </div>
            </div>
            <button
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onComponentDelete(component.id);
              }}
              title="삭제"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
        {components.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            추가된 컴포넌트가 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentListPanel;

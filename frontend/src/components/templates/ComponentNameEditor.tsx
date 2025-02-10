import React, { useState, useEffect } from 'react';
import { CanvasComponent } from '../../types/CanvasComponent';

interface ComponentNameEditorProps {
  selectedComponent?: CanvasComponent;
  onNameChange: (name: string) => void;
}

const ComponentNameEditor: React.FC<ComponentNameEditorProps> = ({ selectedComponent, onNameChange }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (selectedComponent) {
      setName(selectedComponent.name);
    }
  }, [selectedComponent]);

  if (!selectedComponent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNameChange(name);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-200">
      <label className="block text-sm font-medium mb-1">
        컴포넌트 이름
      </label>
      <div className="flex space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          className="flex-1 p-2 border rounded-md focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          적용
        </button>
      </div>
    </form>
  );
};

export default ComponentNameEditor;

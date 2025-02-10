import React from 'react';

interface ComponentNameEditorProps {
  name: string;
  onNameChange: (name: string) => void;
}

const ComponentNameEditor: React.FC<ComponentNameEditorProps> = ({
  name,
  onNameChange,
}) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        컴포넌트 이름
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default ComponentNameEditor;

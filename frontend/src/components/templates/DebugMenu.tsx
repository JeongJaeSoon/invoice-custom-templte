import { useTemplateStore } from '../../store/templateStore';

const DebugMenu = () => {
  const getTemplateJson = useTemplateStore((state) => state.getTemplateJson);

  const handleDebugClick = () => {
    const templateData = getTemplateJson();
    console.log('Template JSON:', templateData);
    alert('템플릿 JSON이 콘솔에 출력되었습니다.');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleDebugClick}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
      >
        디버그 메뉴
      </button>
    </div>
  );
};

export default DebugMenu;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from './components/ui/button';

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Invoice Custom Template
      </h1>
      <div>
      <Button>Click me</Button>

      </div>

    <Router>
      <Routes>
        {/* 템플릿 관련 URL */}
        <Route path="/templates" element={<div>템플릿 목록 페이지 (추후 구현)</div>} />
        <Route path="/templates/:id/edit" element={<div>템플릿 편집 페이지 (추후 구현)</div>} />
        <Route path="/templates/:id/preview" element={<div>PDF 미리보기 페이지 (추후 구현)</div>} />

        {/* 청구서 관련 URL */}
        <Route path="/invoices" element={<div>청구서 목록 페이지 (추후 구현)</div>} />
        <Route path="/invoices/new" element={<div>새 청구서 작성 페이지 (추후 구현)</div>} />
        <Route path="/invoices/:id/edit" element={<div>청구서 수정 페이지 (추후 구현)</div>} />
        <Route path="/invoices/:id/preview" element={<div>PDF 미리보기 페이지 (추후 구현)</div>} />
        <Route path="/invoices/:id/download" element={<div>PDF 다운로드 페이지 (추후 구현)</div>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;

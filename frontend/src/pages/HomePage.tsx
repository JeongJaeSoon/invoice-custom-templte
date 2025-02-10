import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              인보이스 템플릿 시스템
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              청구서, 납품서, 견적서 등의 문서를 자유롭게 편집하고 관리하세요.
              템플릿을 재사용하거나 커스터마이징할 수 있습니다.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/templates/new"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                템플릿 만들기
              </Link>
              <Link
                to="/invoices"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                청구서 목록 보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

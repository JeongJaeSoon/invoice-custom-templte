import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import HomePage from './pages/HomePage';
import TemplateListPage from './pages/templates/TemplateListPage';
import TemplateEditPage from './pages/templates/TemplateEditPage';
import TemplatePreviewPage from './pages/templates/TemplatePreviewPage';
import InvoiceListPage from './pages/invoices/InvoiceListPage';
import InvoiceNewPage from './pages/invoices/InvoiceNewPage';
import InvoiceEditPage from './pages/invoices/InvoiceEditPage';
import InvoicePreviewPage from './pages/invoices/InvoicePreviewPage';

const navigation = [
  { name: '템플릿 목록', href: '/templates' },
  { name: '청구서 목록', href: '/invoices' },
];

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Disclosure as="nav" className="bg-white shadow-sm">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <Link to="/" className="text-xl font-bold text-indigo-600">
                        인보이스 시스템
                      </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                      <span className="sr-only">메뉴 열기</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="py-10">
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/templates" element={<TemplateListPage />} />
                <Route path="/templates/:id/edit" element={<TemplateEditPage />} />
                <Route path="/templates/:id/preview" element={<TemplatePreviewPage />} />
                <Route path="/invoices" element={<InvoiceListPage />} />
                <Route path="/invoices/new" element={<InvoiceNewPage />} />
                <Route path="/invoices/:id/edit" element={<InvoiceEditPage />} />
                <Route path="/invoices/:id/preview" element={<InvoicePreviewPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

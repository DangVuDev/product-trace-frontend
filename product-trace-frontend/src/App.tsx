// src/App.tsx
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../src/store/store';
import { logout } from '../src/store/slices/authSlice';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import SearchProduct from './components/SearchProduct';
import PublicProductView from './components/PublicProductView';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import { Package, Home, PlusCircle, Search, LogOut } from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';
import { store } from '../src/store/store';

// === COMPONENT: Navigation ===
function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path: string) => active.startsWith(path);

  return (
    <>
      {/* Desktop */}
      <header className="bg-white shadow-md sticky top-0 z-40 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Product Trace
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/') ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Home className="w-5 h-5" /> Trang chủ
            </button>
            <button
              onClick={() => navigate('/add')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/add') ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <PlusCircle className="w-5 h-5" /> Thêm SP
            </button>
            <button
              onClick={() => navigate('/search')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/search') ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Search className="w-5 h-5" /> Tra cứu
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium flex items-center gap-2 transition-all"
            >
              <LogOut className="w-5 h-5" /> Đăng xuất
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 shadow-lg">
        <div className="flex justify-around py-3">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1 ${
              isActive('/') ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Trang chủ</span>
          </button>
          <button
            onClick={() => navigate('/add')}
            className={`flex flex-col items-center gap-1 ${
              isActive('/add') ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs">Thêm</span>
          </button>
          <button
            onClick={() => navigate('/search')}
            className={`flex flex-col items-center gap-1 ${
              isActive('/search') ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Tra cứu</span>
          </button>
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-600">
            <LogOut className="w-6 h-6" />
            <span className="text-xs">Thoát</span>
          </button>
        </div>
      </div>
    </>
  );
}

// === COMPONENT: Protected Route ===
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  return (
    <>
      <Navigation />
      {children}
    </>
  );
}

// === COMPONENT: App Router ===
function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 sm:pb-0">
        <Toast />
        <Routes>
          {/* PUBLIC ROUTE */}
          <Route path="/product/:id" element={<PublicProductView />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <ProductList />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <AddProductForm />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <SearchProduct />
                </div>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center py-20">
                <Package className="w-20 h-20 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">404 - Không tìm thấy trang</h1>
                <Link to="/" className="mt-4 text-indigo-600 hover:underline font-medium">
                  Quay lại trang chủ
                </Link>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// === MAIN APP ===
export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}
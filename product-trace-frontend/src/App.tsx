// src/App.tsx
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm';
import SearchProduct from './components/SearchProduct';
import PublicProductView from './components/PublicProductView';
import { Package, Home, PlusCircle, Search, Lock, LogOut, AlertCircle } from 'lucide-react';
import { useState, useEffect, type JSX } from 'react';

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'admin123456'; // Mặc định nếu không có .env
console.log('Admin Key:', ADMIN_KEY); // Debug

// === COMPONENT: Login Modal ===
function LoginModal({ onSuccess }: { onSuccess: () => void }) {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (inputKey == ADMIN_KEY) {
      localStorage.setItem('admin_key', inputKey);
      onSuccess();
    } else {
      setError('Mã khóa không đúng!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
        <div className="flex items-center gap-3 mb-5">
          <Lock className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Đăng nhập quản trị</h2>
        </div>

        <p className="text-gray-600 mb-4">
          Vui lòng nhập mã khóa để truy cập khu vực quản trị.
        </p>

        <input
          type="password"
          placeholder="Nhập mã khóa..."
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent mb-3"
        />

        {error && (
          <p className="text-red-600 text-sm mb-3 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all"
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}

// === COMPONENT: Navigation (có logout) ===
function Navigation({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  const isActive = (path: string) => active.startsWith(path);

  return (
    <>
      {/* Desktop */}
      <header className="bg-white shadow-md sticky top-0 z-40 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold">Product Trace</h1>
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/') ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Home className="w-5 h-5" /> Trang chủ
            </button>
            <button
              onClick={() => navigate('/add')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/add') ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <PlusCircle className="w-5 h-5" /> Thêm SP
            </button>
            <button
              onClick={() => navigate('/search')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isActive('/search') ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Search className="w-5 h-5" /> Tra cứu
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium flex items-center gap-2 transition-all"
            >
              <LogOut className="w-5 h-5" /> Đăng xuất
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex justify-around py-2">
          <button onClick={() => navigate('/')} className={isActive('/') ? 'text-indigo-600' : 'text-gray-600'}>
            <Home className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('/add')} className={isActive('/add') ? 'text-indigo-600' : 'text-gray-600'}>
            <PlusCircle className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('/search')} className={isActive('/search') ? 'text-indigo-600' : 'text-gray-600'}>
            <Search className="w-6 h-6" />
          </button>
          <button onClick={onLogout} className="text-red-600">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
}

// === COMPONENT: Protected Route ===
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey === ADMIN_KEY) {
      setIsAuthenticated(true);
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_key');
    setIsAuthenticated(false);
    setShowLogin(true);
    navigate('/');
  };

  if (!isAuthenticated) {
    return showLogin ? <LoginModal onSuccess={handleLoginSuccess} /> : null;
  }

  return (
    <>
      <Navigation onLogout={handleLogout} />
      {children}
    </>
  );
}

// === MAIN APP ===
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0">
        <Routes>
          {/* PUBLIC ROUTE - Không cần đăng nhập */}
          <Route path="/product/:id" element={<PublicProductView />} />

          {/* PROTECTED ROUTES - Cần đăng nhập */}
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
                <h1 className="text-2xl font-bold text-gray-800">404 - Không tìm thấy</h1>
                <Link to="/" className="mt-4 text-indigo-600 hover:underline">
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
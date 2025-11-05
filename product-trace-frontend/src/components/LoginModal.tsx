// src/components/LoginModal.tsx
import { useState } from 'react';
import { useAppDispatch } from '../store/store';
import { login } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import { Lock, AlertCircle } from 'lucide-react';

export default function LoginModal() {
  const dispatch = useAppDispatch();
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'admin123456';

    if (inputKey === ADMIN_KEY) {
      dispatch(login(inputKey));
      dispatch(showToast({ type: 'success', message: 'Đăng nhập thành công!' }));
    } else {
      setError('Mã khóa không đúng!');
      dispatch(showToast({ type: 'error', message: 'Mã khóa không đúng!' }));
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Đăng nhập</h2>
            <p className="text-sm text-gray-500">Khu vực quản trị</p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Vui lòng nhập mã khóa để truy cập trang quản trị sản phẩm.
        </p>

        <form onSubmit={handleLogin}>
          <div className="relative">
            <input
              type="password"
              placeholder="Nhập mã khóa..."
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-600'
              }`}
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !inputKey.trim()}
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Đang xác thực...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Liên hệ quản trị viên nếu bạn quên mã khóa
          </p>
        </div>
      </div>
    </div>
  );
}
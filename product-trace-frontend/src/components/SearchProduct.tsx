// src/components/SearchProduct.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchProductById, clearSelectedProduct } from '../store/slices/productsSlice';
import { showToast } from '../store/slices/uiSlice';
import { Search, Package, MapPin, Loader2 } from 'lucide-react';

export default function SearchProduct() {
  const dispatch = useAppDispatch();
  const { selectedProduct: product, loading } = useAppSelector((state) => state.products);
  const [id, setId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!id.trim()) {
      dispatch(showToast({ type: 'warning', message: 'Vui lòng nhập ID sản phẩm' }));
      return;
    }

    setSearched(true);
    try {
      await dispatch(fetchProductById(id.trim())).unwrap();
    } catch (error: any) {
      dispatch(showToast({ type: 'error', message: error || 'Không tìm thấy sản phẩm' }));
    }
  };

  const handleReset = () => {
    setId('');
    setSearched(false);
    dispatch(clearSelectedProduct());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Search className="w-6 h-6 text-indigo-600" />
          Tra cứu sản phẩm
        </h2>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Nhập ID sản phẩm..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent focus:outline-none text-lg transition-all"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !id.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-all shadow-md"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            Tìm
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="inline-block w-10 h-10 animate-spin text-indigo-600 mb-3" />
            <p className="text-gray-600 font-medium">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Product Found */}
        {!loading && product && searched && (
          <div className="space-y-5 animate-fadeIn">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-56 object-cover rounded-xl shadow-md"
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {product.manufacturer}
              </p>
              <p className="text-sm text-gray-500 mt-1">Mã sản phẩm: #{product.productId}</p>
            </div>

            {product.currentStatus && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                <p className="font-bold text-green-900">{product.currentStatus.status}</p>
                <p className="text-sm text-green-700 mt-1">{product.currentStatus.details}</p>
                <p className="text-xs text-green-600 mt-2">
                  {new Date(product.currentStatus.timestamp).toLocaleString('vi-VN')}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Link
                to={`/product/${product.productId}`}
                className="flex-1 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all shadow-md"
              >
                Xem chi tiết hành trình
              </Link>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Tìm khác
              </button>
            </div>
          </div>
        )}

        {/* Not Found */}
        {!loading && !product && searched && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-lg mb-2">Không tìm thấy sản phẩm với ID: <strong>{id}</strong></p>
            <button
              onClick={handleReset}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Initial State */}
        {!loading && !searched && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-16 h-16 mx-auto mb-3" />
            <p className="text-lg">Nhập ID sản phẩm để bắt đầu tra cứu</p>
          </div>
        )}
      </div>
    </div>
  );
}
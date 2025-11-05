// src/components/SearchProduct.tsx
import { useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Package, MapPin } from 'lucide-react';

export default function SearchProduct() {
  const [id, setId] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const search = async () => {
    if (!id.trim()) return;
    setLoading(true);
    setError(false);
    setProduct(null);

    try {
      const p = await api.getProduct(id);
      setProduct(p);
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
      setProduct(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Search className="w-6 h-6 text-indigo-600" />
          Tra cứu sản phẩm
        </h2>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={id}
            onChange={e => setId(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && search()}
            placeholder="Nhập ID sản phẩm..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-lg"
          />
          <button
            onClick={search}
            disabled={loading || !id.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
          >
            <Search className="w-5 h-5" />
            Tìm
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
            <p className="mt-3 text-gray-600">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Kết quả có sản phẩm */}
        {product && !loading && (
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
            </div>

            {/* Bảo vệ: kiểm tra currentStatus tồn tại */}
            {product.currentStatus && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                <p className="font-bold text-green-900">
                  {product.currentStatus.status || 'Không có trạng thái'}
                </p>
                <p className="text-sm text-green-700">
                  {product.currentStatus.details || 'Không có chi tiết'}
                </p>
              </div>
            )}

            <Link
              to={`/product/${product.productId}`}
              className="block text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all"
            >
              Xem chi tiết hành trình
            </Link>
          </div>
        )}

        {/* Không tìm thấy */}
        {!loading && !product && (id.trim() || error) && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">
              Không tìm thấy sản phẩm với ID: <strong>{id}</strong>
            </p>
            {error && <p className="text-sm text-red-600 mt-2">Lỗi kết nối server</p>}
          </div>
        )}
      </div>
    </div>
  );
}
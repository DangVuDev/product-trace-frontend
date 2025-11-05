// src/components/ProductList.tsx
import { useState, useEffect } from 'react';
import { api, type Product } from '../services/api';
import ProductCard from './ProductCard';
import { Package, Loader2, AlertCircle } from 'lucide-react';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load toàn bộ danh sách sản phẩm (không phân trang)
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error('Dữ liệu không hợp lệ');
        }
      } catch (err: any) {
        console.error('Lỗi khi tải danh sách sản phẩm:', err);
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // === TRẠNG THÁI LOADING ===
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-lg text-gray-600 font-medium">Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

  // === TRẠNG THÁI LỖI ===
  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Không thể tải danh sách
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // === TRẠNG THÁI KHÔNG CÓ SẢN PHẨM ===
  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <Package className="w-20 h-20 mx-auto mb-5 text-gray-300" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Chưa có sản phẩm nào
        </h3>
        <p className="text-gray-600 text-lg">
          Hãy <span className="text-indigo-600 font-medium">thêm sản phẩm đầu tiên</span> của bạn!
        </p>
      </div>
    );
  }

  // === HIỂN THỊ DANH SÁCH ===
  return (
    <div className="space-y-10">
      {/* Tiêu đề + Tổng số */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Danh sách sản phẩm
        </h2>
        <p className="text-lg text-gray-600">
          Tổng cộng <span className="font-bold text-indigo-600">{products.length}</span> sản phẩm
        </p>
      </div>

      {/* Grid sản phẩm - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>

      {/* Thông tin thêm (tùy chọn) */}
      <div className="text-center text-sm text-gray-500 mt-12">
        Đã hiển thị toàn bộ sản phẩm trong hệ thống
      </div>
    </div>
  );
}
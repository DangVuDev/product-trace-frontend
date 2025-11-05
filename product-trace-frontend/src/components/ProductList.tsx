// src/components/ProductList.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchProducts } from '../store/slices/productsSlice';
import ProductCard from './ProductCard';
import { Package, Loader2, AlertCircle } from 'lucide-react';

export default function ProductList() {
  const dispatch = useAppDispatch();
  const { items: products, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // === LOADING STATE ===
  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="text-lg text-gray-600 font-medium">Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

  // === ERROR STATE ===
  if (error && products.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h3 className="text-xl font-semibold text-red-600 mb-2">Không thể tải danh sách</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchProducts())}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // === EMPTY STATE ===
  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <Package className="w-20 h-20 mx-auto mb-5 text-gray-300" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa có sản phẩm nào</h3>
        <p className="text-gray-600 text-lg">
          Hãy <span className="text-indigo-600 font-medium">thêm sản phẩm đầu tiên</span> của bạn!
        </p>
      </div>
    );
  }

  // === PRODUCTS DISPLAY ===
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Danh sách sản phẩm
        </h2>
        <p className="text-lg text-gray-600">
          Tổng cộng <span className="font-bold text-indigo-600">{products.length}</span> sản phẩm
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>

      {/* Loading overlay khi refresh */}
      {loading && products.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          <span className="text-sm font-medium">Đang cập nhật...</span>
        </div>
      )}
    </div>
  );
}
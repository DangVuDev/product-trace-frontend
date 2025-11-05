// src/components/PublicProductView.tsx
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Timeline from './Timeline';
import QRCode from 'qrcode';
import {
  Home, Package, MapPin, Clock, ExternalLink, Edit3, Check, X, QrCode as QrIcon
} from 'lucide-react';

interface StatusHistory {
  status: string;
  details: string;
  timestamp: string;
  location?: string;
}

interface Product {
  productId: number;
  name: string;
  manufacturer: string;
  imageUrl: string;
  qrCodeUrl: string;
  statuses: StatusHistory[];
}

export default function PublicProductView() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Modal QR
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  // Form cập nhật trạng thái (Admin)
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [updating, setUpdating] = useState(false);

  const isAdmin = true; // Thay bằng logic thực tế

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const p = await api.getProduct(id);
      if (p && Array.isArray(p.statuses)) {
        setProduct(p as unknown as Product);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Tạo QR Code từ URL hiện tại
  const generateQR = async () => {
    try {
      const url = window.location.href;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff',
        },
      });
      setQrCodeDataURL(dataUrl);
      setShowQRModal(true);
    } catch (err) {
      console.error('Lỗi tạo QR:', err);
      alert('Không thể tạo QR Code');
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus.trim() || !newDetails.trim()) {
      alert('Vui lòng nhập đầy đủ');
      return;
    }
    setUpdating(true);
    try {
      await api.updateStatus(id!, { status: newStatus, details: newDetails });
      await fetchProduct();
      setNewStatus('');
      setNewDetails('');
      setShowUpdateForm(false);
      alert('Cập nhật thành công!');
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-lg text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Package className="w-20 h-20 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-red-600 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-600">ID: <strong>{id}</strong></p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
          <Home className="w-5 h-5" /> Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const currentStatus = product.statuses[product.statuses.length - 1];
  const historyForTimeline = product.statuses.map(s => ({
    ...s,
    timestamp: Math.floor(new Date(s.timestamp).getTime() / 1000).toString()
  }));

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="grid md:grid-cols-2 gap-0">
          <img src={product.imageUrl} alt={product.name} className="w-full h-80 md:h-full object-cover" />
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="space-y-3 mb-6">
                <p className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">Nhà sản xuất:</span> {product.manufacturer}
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">Mã sản phẩm:</span> #{product.productId}
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                <p className="font-bold text-green-900 text-lg">{currentStatus.status}</p>
                <p className="text-sm text-green-700 mt-1">{currentStatus.details}</p>
                <p className="text-xs text-green-600 mt-2">
                  {new Date(currentStatus.timestamp).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {/* Nút mở QR Modal */}
              <button
                onClick={generateQR}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-medium shadow-md"
              >
                <QrIcon className="w-5 h-5" />
                Hiển thị QR Code
              </button>

              {isAdmin && (
                <button
                  onClick={() => setShowUpdateForm(!showUpdateForm)}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Edit3 className="w-5 h-5" />
                  {showUpdateForm ? 'Hủy' : 'Cập nhật trạng thái'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form cập nhật trạng thái */}
      {isAdmin && showUpdateForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-purple-200">
          <h3 className="text-xl font-bold mb-4 text-purple-700">Cập nhật trạng thái mới</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Trạng thái (VD: Đã giao hàng)"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
            <textarea
              placeholder="Chi tiết (VD: Giao đến tay khách hàng tại Hà Nội)"
              value={newDetails}
              onChange={e => setNewDetails(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                <Check className="w-5 h-5" />
                {updating ? 'Đang cập nhật...' : 'Xác nhận'}
              </button>
              <button
                onClick={() => setShowUpdateForm(false)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2 font-medium"
              >
                <X className="w-5 h-5" />
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-600" />
          Hành trình sản phẩm
        </h3>
        <Timeline history={historyForTimeline} />
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
          <Home className="w-5 h-5" />
          Quay lại trang chủ
        </Link>
      </div>

      {/* === MODAL QR CODE === */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-scaleIn">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code truy xuất</h3>
              <div className="bg-gray-100 p-4 rounded-xl inline-block mb-4">
                <img src={qrCodeDataURL} alt="QR Code" className="w-56 h-56" />
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Quét mã để xem chi tiết sản phẩm
              </p>
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 text-sm font-medium hover:underline flex items-center justify-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Mở trong trình duyệt
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// src/components/AddProductForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addProduct } from '../store/slices/productsSlice';
import { showToast } from '../store/slices/uiSlice';
import { Upload, Package, CheckCircle } from 'lucide-react';

export default function AddProductForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.products);

  const [form, setForm] = useState({
    name: '',
    manufacturer: '',
    initialStatus: '',
    initialDetails: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        dispatch(showToast({ type: 'error', message: 'Vui lòng chọn file ảnh hợp lệ' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        dispatch(showToast({ type: 'error', message: 'Kích thước ảnh không được vượt quá 5MB' }));
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.name.trim()) {
      dispatch(showToast({ type: 'warning', message: 'Vui lòng nhập tên sản phẩm' }));
      return;
    }
    if (!form.manufacturer.trim()) {
      dispatch(showToast({ type: 'warning', message: 'Vui lòng nhập nhà sản xuất' }));
      return;
    }
    if (!form.initialStatus.trim()) {
      dispatch(showToast({ type: 'warning', message: 'Vui lòng nhập trạng thái ban đầu' }));
      return;
    }
    if (!form.initialDetails.trim()) {
      dispatch(showToast({ type: 'warning', message: 'Vui lòng nhập chi tiết' }));
      return;
    }
    if (!image) {
      dispatch(showToast({ type: 'warning', message: 'Vui lòng chọn ảnh sản phẩm' }));
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('manufacturer', form.manufacturer.trim());
    formData.append('initialStatus', form.initialStatus.trim());
    formData.append('initialDetails', form.initialDetails.trim());
    formData.append('image', image, image.name);

    try {
      const result = await dispatch(addProduct(formData)).unwrap();
      
      dispatch(showToast({ 
        type: 'success', 
        message: `Thêm sản phẩm thành công! ID: ${result?.productId}` 
      }));

      // Reset form
      setForm({ name: '', manufacturer: '', initialStatus: '', initialDetails: '' });
      setImage(null);
      setPreview('');

      // Navigate to product detail after 1.5s
      setTimeout(() => {
        navigate(`/product/${result?.productId}`);
      }, 1500);
    } catch (error: any) {
      dispatch(showToast({ 
        type: 'error', 
        message: error || 'Không thể thêm sản phẩm' 
      }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-indigo-600" />
          Thêm sản phẩm mới
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          <input
            placeholder="Tên sản phẩm *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            disabled={loading}
          />
          <input
            placeholder="Nhà sản xuất *"
            value={form.manufacturer}
            onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            disabled={loading}
          />
          <input
            placeholder="Trạng thái ban đầu *"
            value={form.initialStatus}
            onChange={(e) => setForm({ ...form, initialStatus: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            disabled={loading}
          />
          <textarea
            placeholder="Chi tiết *"
            value={form.initialDetails}
            onChange={(e) => setForm({ ...form, initialDetails: e.target.value })}
            rows={3}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none md:col-span-2"
            disabled={loading}
          />
        </div>

        <div className="mt-5">
          <label className={`flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer w-fit transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload className="w-5 h-5" />
            Chọn ảnh
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImage} 
              className="hidden" 
              disabled={loading}
            />
          </label>

          {preview && (
            <div className="mt-3 flex items-center gap-3">
              <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
              <button
                onClick={() => {
                  setImage(null);
                  setPreview('');
                }}
                className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                disabled={loading}
              >
                Xóa
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Thêm sản phẩm
            </>
          )}
        </button>
      </div>
    </div>
  );
}
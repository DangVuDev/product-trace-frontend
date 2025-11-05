// src/components/AddProductForm.tsx
import { useState } from 'react';
import { api } from '../services/api';
import { Upload, Package, CheckCircle } from 'lucide-react';

export default function AddProductForm() {
  const [form, setForm] = useState({
    name: '',
    manufacturer: '',
    initialStatus: '',
    initialDetails: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const submit = async () => {
    if (!form.name || !form.manufacturer || !form.initialStatus || !form.initialDetails || !image) {
      alert('Vui lòng điền đầy đủ');
      return;
    }

    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('manufacturer', form.manufacturer);
    formData.append('initialStatus', form.initialStatus);
    formData.append('initialDetails', form.initialDetails);
    formData.append('image', image, image.name); // Đảm bảo tên file

    try {
      const result = await api.addProduct(formData);
      console.log('Thành công:', result);
      setSuccess(true);
      alert(`Thêm thành công! ID: ${result.productId}`);
      // Reset form
      setForm({ name: '', manufacturer: '', initialStatus: '', initialDetails: '' });
      setImage(null);
      setPreview('');
    } catch (err: any) {
      console.error('Lỗi:', err);
      alert('Lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-indigo-600" />
          Thêm sản phẩm mới
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            Thêm sản phẩm thành công!
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <input
            placeholder="Tên sản phẩm *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
          />
          <input
            placeholder="Nhà sản xuất *"
            value={form.manufacturer}
            onChange={e => setForm({ ...form, manufacturer: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
          />
          <input
            placeholder="Trạng thái ban đầu *"
            value={form.initialStatus}
            onChange={e => setForm({ ...form, initialStatus: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
          />
          <textarea
            placeholder="Chi tiết *"
            value={form.initialDetails}
            onChange={e => setForm({ ...form, initialDetails: e.target.value })}
            rows={3}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 md:col-span-2"
          />
        </div>

        <div className="mt-5">
          <label className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer w-fit">
            <Upload className="w-5 h-5" />
            Chọn ảnh
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>

          {preview && (
            <div className="mt-3 flex items-center gap-3">
              <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
              <button
                onClick={() => { setImage(null); setPreview(''); }}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Xóa
              </button>
            </div>
          )}
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-medium text-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              Đang xử lý...
            </>
          ) : (
            'Thêm sản phẩm'
          )}
        </button>
      </div>
    </div>
  );
}
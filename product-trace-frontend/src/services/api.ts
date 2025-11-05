// src/services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export interface StatusHistory {
  status: string;
  details: string;
  timestamp: string; // ISO string: "2025-11-04T22:19:24+07:00"
  location?: string;
}

export interface Product {
  statuses(statuses: any): unknown;
  productId: number;
  name: string;
  manufacturer: string;
  currentStatus: StatusHistory;
  qrCodeUrl: string;
  imageUrl: string;
  history?: StatusHistory[];
}

export const api = {
  addProduct: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/product/add`, {
      method: 'POST',
      body: formData,
      // KHÔNG ĐẶT headers: 'Content-Type' → trình duyệt tự set boundary
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Thêm thất bại: ${res.status} - ${error}`);
    }
    return res.json();
  },

  getProduct: async (id: string): Promise<Product | null> => {
    try {
      const res = await fetch(`${API_BASE}/product/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  updateStatus: async (id: string, data: { status: string; details: string }) => {
    const res = await fetch(`${API_BASE}/product/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Cập nhật thất bại');
    return res.json();
  },

  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Lấy danh sách thất bại');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
    }
};
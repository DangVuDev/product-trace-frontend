// src/services/api.ts
import type {Product, UpdateStatusDTO, APIError } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://yeuanhdiem.ddns.net/api/product-trace';

class APIService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: APIError = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      };

      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.code = errorData.code;
      } catch {
        // If JSON parsing fails, use default error message
      }

      throw error;
    }

    return response.json();
  }

  async addProduct(formData: FormData): Promise<{ productId: number; message: string }> {
    const response = await fetch(`${API_BASE}/product/add`, {
      method: 'POST',
      body: formData,
    });

    return this.handleResponse(response);
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE}/product/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async updateStatus(
    id: string,
    data: UpdateStatusDTO
  ): Promise<{ message: string; timestamp: string }> {
    const response = await fetch(`${API_BASE}/product/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/products`);
    const data = await this.handleResponse<Product[]>(response);
    return Array.isArray(data) ? data : [];
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/product/${id}`, {
      method: 'DELETE',
    });

    return this.handleResponse(response);
  }
}

export const api = new APIService();
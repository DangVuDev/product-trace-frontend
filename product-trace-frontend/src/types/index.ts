export interface StatusHistory {
  status: string;
  details: string;
  timestamp: string; // ISO string
  location?: string;
}

export interface Product {
  productId: number;
  name: string;
  manufacturer: string;
  currentStatus: StatusHistory;
  qrCodeUrl: string;
  imageUrl: string;
  statuses: StatusHistory[];
}

export interface AddProductDTO {
  name: string;
  manufacturer: string;
  initialStatus: string;
  initialDetails: string;
  image: File;
}

export interface UpdateStatusDTO {
  status: string;
  details: string;
  location?: string;
}

export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
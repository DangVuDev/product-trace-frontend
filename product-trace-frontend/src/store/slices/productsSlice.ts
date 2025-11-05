// src/store/slices/productsSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import type { Product} from '../../types';

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  searchCache: Record<string, Product>;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
  searchCache: {},
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getProducts();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải danh sách sản phẩm');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      // Check cache first
      const state = getState() as { products: ProductsState };
      if (state.products.searchCache[id]) {
        return state.products.searchCache[id];
      }
      
      const data = await api.getProduct(id);
      if (!data) {
        throw new Error('Không tìm thấy sản phẩm');
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải sản phẩm');
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/add',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const result = await api.addProduct(formData);
      // Fetch the newly created product
      const newProduct = await api.getProduct(result.productId.toString());
      return newProduct;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể thêm sản phẩm');
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  'products/updateStatus',
  async (
    { id, status, details }: { id: string; status: string; details: string },
    { rejectWithValue }
  ) => {
    try {
      await api.updateStatus(id, { status, details });
      // Fetch updated product
      const updatedProduct = await api.getProduct(id);
      return updatedProduct;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể cập nhật trạng thái');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        // Cache the result
        state.searchCache[action.payload.productId.toString()] = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add product
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update status
    builder
      .addCase(updateProductStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.selectedProduct = action.payload;
          // Update in list if exists
          const index = state.items.findIndex(
            (p) => p.productId === action.payload!.productId
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          // Update cache
          state.searchCache[action.payload.productId.toString()] = action.payload;
        }
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedProduct, setSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
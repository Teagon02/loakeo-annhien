import { create } from "zustand";
import { Product } from "./sanity.types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];
  setItems: (items: CartItem[]) => void;
  // Sync with server
  loadCartFromServer: () => Promise<void>;
  saveCartToServer: () => Promise<void>;
  isLoadingCart: boolean;
  isSavingCart: boolean;
  //favorite
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
  // Sync wishlist with server
  loadWishlistFromServer: () => Promise<void>;
  saveWishlistToServer: () => Promise<void>;
  isLoadingWishlist: boolean;
  isSavingWishlist: boolean;
}

const useStore = create<StoreState>()((set, get) => ({
  items: [],
  favoriteProduct: [],
  isLoadingCart: false,
  isSavingCart: false,
  isLoadingWishlist: false,
  isSavingWishlist: false,
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product._id === product._id
      );
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          items: [...state.items, { product: product, quantity: 1 }],
        };
      }
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.reduce((acc, item) => {
        if (item.product._id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]),
    })),
  deleteCartProduct: (productId) =>
    set((state) => ({
      items: state.items.filter(({ product }) => product?._id !== productId),
    })),
  resetCart: () => set({ items: [] }),
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + (item.product.price ?? 0) * item.quantity,
      0
    );
  },
  getSubTotalPrice: () => {
    return get().items.reduce((total, item) => {
      const price = item.product.price ?? 0;
      const discount = ((item.product.discount ?? 0) * price) / 100;
      const discountedPrice = price + discount;
      return total + discountedPrice * item.quantity;
    }, 0);
  },
  getItemCount: (productId) => {
    const item = get().items.find((item) => item.product._id === productId);
    return item ? item.quantity : 0;
  },
  getGroupedItems: () => get().items,
  setItems: (newItems) => set({ items: newItems }),

  // Load cart from server
  loadCartFromServer: async () => {
    set({ isLoadingCart: true });
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        // 401 là bình thường khi user chưa đăng nhập, không cần log error
        if (response.status === 401) {
          set({ items: [] });
          return;
        }
        throw new Error("Failed to load cart");
      }
      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        set({ items: data.items });
      } else {
        set({ items: [] });
      }
    } catch (error) {
      console.error("Error loading cart from server:", error);
      // Không set items = [] khi có lỗi thật sự để tránh mất dữ liệu local
    } finally {
      set({ isLoadingCart: false });
    }
  },

  // Save cart to server
  saveCartToServer: async () => {
    const { items } = get();
    set({ isSavingCart: true });
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) {
        // 401 là bình thường khi user chưa đăng nhập, không cần log error
        if (response.status === 401) {
          return;
        }
        throw new Error("Failed to save cart");
      }
    } catch (error) {
      console.error("Error saving cart to server:", error);
    } finally {
      set({ isSavingCart: false });
    }
  },

  // favorite
  addToFavorite: (product: Product) => {
    return new Promise<void>((resolve) => {
      set((state: StoreState) => {
        const isFavorite = state.favoriteProduct.some(
          (item) => item._id === product._id
        );
        return {
          favoriteProduct: isFavorite
            ? state.favoriteProduct.filter((item) => item._id !== product._id)
            : [...state.favoriteProduct, { ...product }],
        };
      });
      resolve();
    });
  },
  removeFromFavorite: (productId: string) => {
    set((state: StoreState) => ({
      favoriteProduct: state.favoriteProduct.filter(
        (item) => item?._id !== productId
      ),
    }));
  },
  resetFavorite: () => {
    set({ favoriteProduct: [] });
  },

  // Load wishlist from server
  loadWishlistFromServer: async () => {
    set({ isLoadingWishlist: true });
    try {
      const response = await fetch("/api/wishlist");
      if (!response.ok) {
        // 401 là bình thường khi user chưa đăng nhập, không cần log error
        if (response.status === 401) {
          set({ favoriteProduct: [] });
          return;
        }
        throw new Error("Failed to load wishlist");
      }
      const data = await response.json();
      if (data.products && Array.isArray(data.products)) {
        set({ favoriteProduct: data.products });
      } else {
        set({ favoriteProduct: [] });
      }
    } catch (error) {
      console.error("Error loading wishlist from server:", error);
      // Không set favoriteProduct = [] khi có lỗi thật sự để tránh mất dữ liệu local
    } finally {
      set({ isLoadingWishlist: false });
    }
  },

  // Save wishlist to server
  saveWishlistToServer: async () => {
    const { favoriteProduct } = get();
    set({ isSavingWishlist: true });
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: favoriteProduct }),
      });
      if (!response.ok) {
        // 401 là bình thường khi user chưa đăng nhập, không cần log error
        if (response.status === 401) {
          return;
        }
        throw new Error("Failed to save wishlist");
      }
    } catch (error) {
      console.error("Error saving wishlist to server:", error);
    } finally {
      set({ isSavingWishlist: false });
    }
  },
}));

export default useStore;

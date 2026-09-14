export interface CartItem {
  id: string;
  cakeId: string;
  cakeSlug: string;
  cakeName: string;
  quantity: number;
  unitPrice: number;
  customization: Record<string, never>;
}

export interface Cart {
  id: string | null;
  revision: number;
  items: CartItem[];
  subtotal: number;
}

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Cart, CartItem } from "@/types/cart";

const emptyCustomizationSchema = z.record(z.string(), z.never()).default({});
const quantitySchema = z.number().int().min(1).max(20);

type RawCartItem = {
  id: string;
  cart_id: string;
  cake_id: string;
  weight_option_id: string | null;
  quantity: number;
  customization: Record<string, never>;
};

type RawCake = {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  is_active: boolean;
  availability: "available" | "unavailable";
  category: { is_active: boolean }[] | null;
  cake_weight_options: { id: string; label: string; price: number; is_available: boolean }[] | null;
};

export function validateCartQuantity(value: unknown) {
  return quantitySchema.parse(value);
}

export function validateCartCustomization(value: unknown) {
  const parsed = emptyCustomizationSchema.parse(value ?? {});
  if (Object.keys(parsed).length > 0) throw new Error("Customizations are not supported yet.");
  return parsed;
}

async function loadCartRows() {
  const supabase = await createClient();
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id, revision")
    .maybeSingle();
  if (cartError) throw new Error("Unable to load your cart.");
  if (!cart) return { cart: null, items: [] as RawCartItem[] };

  const { data: items, error: itemError } = await supabase
    .from("cart_items")
    .select("id, cart_id, cake_id, weight_option_id, quantity, customization")
    .eq("cart_id", cart.id)
    .order("created_at", { ascending: true });
  if (itemError) throw new Error("Unable to load your cart items.");
  return { cart, items: (items ?? []) as RawCartItem[] };
}

export async function getCurrentUserCart(): Promise<Cart> {
  const { cart, items } = await loadCartRows();
  if (!cart || items.length === 0) {
    return { id: cart?.id ?? null, revision: cart?.revision ?? 0, items: [], subtotal: 0 };
  }

  const supabase = await createClient();
  const { data: cakes, error } = await supabase
    .from("cakes")
    .select("id, name, slug, base_price, sale_price, is_active, availability, category:cake_categories!inner(is_active), cake_weight_options(id, label, price, is_available)")
    .in("id", items.map((item) => item.cake_id));
  if (error) throw new Error("Unable to validate your cart prices.");

  const cakeMap = new Map((cakes as RawCake[]).map((cake) => [cake.id, cake]));
  const mappedItems: CartItem[] = [];
  for (const item of items) {
    const cake = cakeMap.get(item.cake_id);
    if (!cake || !cake.is_active || cake.availability !== "available" || !cake.category?.[0]?.is_active) continue;
    const weight = cake.cake_weight_options?.find((option) => option.id === item.weight_option_id);
    if (cake.cake_weight_options?.some((option) => option.is_available) && (!weight || !weight.is_available)) continue;
    mappedItems.push({
      id: item.id,
      cakeId: item.cake_id,
      cakeSlug: cake.slug,
      cakeName: cake.name,
      quantity: item.quantity,
      unitPrice: weight ? Number(weight.price) : Number(cake.sale_price ?? cake.base_price),
      weightOptionId: item.weight_option_id,
      weightLabel: weight?.label ?? null,
      customization: item.customization,
    });
  }
  return {
    id: cart.id,
    revision: cart.revision,
    items: mappedItems,
    subtotal: mappedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  };
}

export async function addCartItem(cakeId: string, quantity: unknown, weightOptionId: unknown, customization: unknown = {}) {
  const parsedQuantity = validateCartQuantity(quantity);
  const parsedCustomization = validateCartCustomization(customization);
  const supabase = await createClient();
  const parsedWeightOptionId = weightOptionId === null || weightOptionId === undefined || weightOptionId === "" ? null : z.string().uuid().parse(weightOptionId);
  const { error } = await supabase.rpc("add_cart_item", {
    target_cake_id: cakeId,
    requested_quantity: parsedQuantity,
    requested_customization: parsedCustomization,
    target_weight_option_id: parsedWeightOptionId,
  });
  if (error) throw new Error(error.message);
  return getCurrentUserCart();
}

export async function updateCartItem(itemId: string, quantity: unknown) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_cart_item", {
    target_item_id: itemId,
    requested_quantity: validateCartQuantity(quantity),
  });
  if (error) throw new Error(error.message);
  return getCurrentUserCart();
}

export async function removeCartItem(itemId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("remove_cart_item", { target_item_id: itemId });
  if (error) throw new Error(error.message);
  return getCurrentUserCart();
}

export async function clearCurrentUserCart() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("clear_cart");
  if (error) throw new Error(error.message);
  return getCurrentUserCart();
}

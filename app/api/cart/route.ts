import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { addCartItem, clearCurrentUserCart, getCurrentUserCart, removeCartItem, updateCartItem } from "@/services/cart";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("add"), cakeId: z.string().uuid(), quantity: z.number().int().optional(), customization: z.record(z.string(), z.unknown()).optional() }),
  z.object({ action: z.literal("update"), itemId: z.string().uuid(), quantity: z.number().int() }),
  z.object({ action: z.literal("remove"), itemId: z.string().uuid() }),
  z.object({ action: z.literal("clear") }),
]);

async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function GET() {
  if (!(await requireUser())) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  return NextResponse.json({ cart: await getCurrentUserCart() });
}

export async function POST(request: Request) {
  if (!(await requireUser())) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  const parsed = actionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart action." }, { status: 400 });
  try {
    const action = parsed.data;
    const cart = action.action === "add"
      ? await addCartItem(action.cakeId, action.quantity ?? 1, action.customization ?? {})
      : action.action === "update"
        ? await updateCartItem(action.itemId, action.quantity)
        : action.action === "remove"
          ? await removeCartItem(action.itemId)
          : await clearCurrentUserCart();
    return NextResponse.json({ cart });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update your cart." }, { status: 400 });
  }
}

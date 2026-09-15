import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrderFromCurrentCart } from "@/services/order";

const createOrderRequestSchema = z.object({
  idempotencyKey: z.string().trim().min(1, "Idempotency key is required."),
  cartRevision: z.number().int().nonnegative().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = createOrderRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order creation payload." }, { status: 400 });
    }

    const order = await createOrderFromCurrentCart(parsed.data);
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create order.";
    if (message === "You must be logged in.") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

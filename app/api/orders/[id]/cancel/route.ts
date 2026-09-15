import { NextResponse } from "next/server";
import { z } from "zod";
import { cancelOrderForCurrentUser } from "@/services/order-lifecycle";
import { customerCancellationReasons } from "@/services/cancellation-reasons";

const cancelOrderSchema = z.object({
  reason: z.enum(customerCancellationReasons),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const parsed = cancelOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid cancellation payload." }, { status: 400 });
    }

    const order = await cancelOrderForCurrentUser(id, parsed.data.reason);
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to cancel this order.";
    if (message === "You must be logged in.") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    if (
      message.includes("cannot be cancelled") ||
      message.includes("already been cancelled") ||
      message.includes("not found or access denied") ||
      message.includes("Invalid cancellation payload") ||
      message.includes("valid cancellation reason")
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

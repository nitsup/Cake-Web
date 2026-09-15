import { NextResponse } from "next/server";
import { z } from "zod";
import { updateOrderStatusForStaff } from "@/services/staff-order-management";

const statusUpdateSchema = z.object({
  status: z.enum(["confirmed", "processing", "completed"]),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = statusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order status update request." }, { status: 400 });
    }

    const order = await updateOrderStatusForStaff(id, parsed.data.status);
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update this order.";
    if (message === "You must be logged in.") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    if (message.includes("permission") || message.includes("not have permission")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    if (message.includes("cannot be moved") || message.includes("Order not found")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { cakeWriteSchema, createCake } from "@/services/staff-catalogue";

export async function POST(request: Request) {
  try {
    const parsed = cakeWriteSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid catalogue product details." }, { status: 400 });
    const cake = await createCake(parsed.data);
    return NextResponse.json({ cake }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create the catalogue product.";
    if (message === "You must be logged in.") return NextResponse.json({ error: message }, { status: 401 });
    if (message.includes("permission")) return NextResponse.json({ error: message }, { status: 403 });
    if (message.includes("selected category")) return NextResponse.json({ error: message }, { status: 400 });
    if (message.includes("already exists")) return NextResponse.json({ error: message }, { status: 409 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

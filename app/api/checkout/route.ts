import { NextResponse } from "next/server";
import { checkoutPreparationSchema, prepareCheckoutForCurrentUser } from "@/services/checkout";

export async function POST(request: Request) {
  const parsed = checkoutPreparationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout preparation payload." }, { status: 400 });
  }

  try {
    const preparation = await prepareCheckoutForCurrentUser(parsed.data);
    return NextResponse.json(preparation, { status: preparation.valid ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to prepare checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

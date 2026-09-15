import { NextResponse } from "next/server";
import { z } from "zod";
import { cakeWriteSchema, updateCake, updateCakeVisibility } from "@/services/staff-catalogue";

const updateCatalogueSchema = z.object({
  isActive: z.boolean(),
  availability: z.enum(["available", "unavailable"]),
});
const updateCakeSchema = cakeWriteSchema.extend({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const parsed = updateCakeSchema.safeParse(body);
    if (parsed.success) {
      const { id } = await params;
      const cake = await updateCake(id, parsed.data);
      return NextResponse.json({ cake });
    }
    const visibility = updateCatalogueSchema.safeParse(body);
    if (!visibility.success) {
      return NextResponse.json({ error: "Invalid catalogue visibility update." }, { status: 400 });
    }

    const { id } = await params;
    const cake = await updateCakeVisibility(id, visibility.data);
    return NextResponse.json({ cake });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update the catalogue.";
    if (message === "You must be logged in.") return NextResponse.json({ error: message }, { status: 401 });
    if (message.includes("permission")) return NextResponse.json({ error: message }, { status: 403 });
    if (message === "Cake not found.") return NextResponse.json({ error: message }, { status: 404 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { updateCatalogueCategory } from "@/services/staff-catalogue";

const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).nullable(),
  displayPriority: z.number().int().min(0).max(100000),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const parsed = categorySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid category details." }, { status: 400 });
    const { id } = await params;
    const category = await updateCatalogueCategory(id, parsed.data);
    return NextResponse.json({ category });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update the category.";
    if (message === "You must be logged in.") return NextResponse.json({ error: message }, { status: 401 });
    if (message.includes("permission")) return NextResponse.json({ error: message }, { status: 403 });
    if (message === "Category not found.") return NextResponse.json({ error: message }, { status: 404 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

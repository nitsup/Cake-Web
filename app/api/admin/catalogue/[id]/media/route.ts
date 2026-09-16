import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteCakeImage, getCakeImages, setCakeImagePrimary, updateCakeImagePresentation, uploadCakeImage } from "@/services/staff-catalogue";

const mediaActionSchema = z.object({
  imageId: z.string().uuid(),
});

const presentationSchema = mediaActionSchema.extend({
  zoom: z.number().min(1).max(3),
  positionX: z.number().min(0).max(100),
  positionY: z.number().min(0).max(100),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const images = await getCakeImages(id);
    return NextResponse.json({ images });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load the product images.";
    if (message === "You must be logged in.") return NextResponse.json({ error: message }, { status: 401 });
    if (message.includes("permission")) return NextResponse.json({ error: message }, { status: 403 });
    if (message === "Cake not found.") return NextResponse.json({ error: message }, { status: 404 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file was supplied." }, { status: 400 });
    }

    const image = await uploadCakeImage(id, file);
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload the product image.";
    if (message === "You must be logged in.") return NextResponse.json({ error: message }, { status: 401 });
    if (message.includes("permission")) return NextResponse.json({ error: message }, { status: 403 });
    if (message === "Cake not found.") return NextResponse.json({ error: message }, { status: 404 });
    if (message.includes("Use a JPG")) return NextResponse.json({ error: message }, { status: 400 });
    if (message.includes("Apply the SQL in .private/supabase/18_cake_image_storage.txt")) return NextResponse.json({ error: message }, { status: 503 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const presentation = presentationSchema.safeParse(body);
    if (presentation.success) {
      const image = await updateCakeImagePresentation(id, presentation.data.imageId, presentation.data);
      return NextResponse.json({ image });
    }
    const primary = mediaActionSchema.safeParse(body);
    if (!primary.success) {
      return NextResponse.json({ error: "Invalid image action." }, { status: 400 });
    }
    const image = await setCakeImagePrimary(id, primary.data.imageId);
    return NextResponse.json({ image });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update the product image.";
    if (message === "You must be logged in.") return NextResponse.json({ error: message }, { status: 401 });
    if (message.includes("permission")) return NextResponse.json({ error: message }, { status: 403 });
    if (message === "Cake not found.") return NextResponse.json({ error: message }, { status: 404 });
    if (message === "Image not found.") return NextResponse.json({ error: message }, { status: 404 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = mediaActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid image selection." }, { status: 400 });
    }

    const { id } = await params;
    await deleteCakeImage(id, parsed.data.imageId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove the product image.";
    if (message === "You must be logged in.") return NextResponse.json({ error: message }, { status: 401 });
    if (message.includes("permission")) return NextResponse.json({ error: message }, { status: 403 });
    if (message === "Cake not found.") return NextResponse.json({ error: message }, { status: 404 });
    if (message === "Image not found.") return NextResponse.json({ error: message }, { status: 404 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

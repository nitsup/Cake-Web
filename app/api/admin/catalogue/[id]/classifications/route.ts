import { NextResponse } from "next/server";
import { assignCakeClassification, getCakeClassifications, removeCakeClassification } from "@/services/staff-catalogue";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    return NextResponse.json({ classifications: await getCakeClassifications((await params).id) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load classifications." }, { status: 400 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as { name?: unknown };
    return NextResponse.json({ classification: await assignCakeClassification(id, body.name) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to assign classification." }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as { tagId?: unknown };
    if (typeof body.tagId !== "string") throw new Error("Classification id is required.");
    await removeCakeClassification(id, body.tagId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to remove classification." }, { status: 400 });
  }
}

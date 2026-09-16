import { NextResponse } from "next/server";
import { getCakeWeightOptions, saveCakeWeightOption, deleteCakeWeightOption } from "@/services/staff-catalogue";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { return NextResponse.json({ options: await getCakeWeightOptions((await params).id) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load weight options." }, { status: 400 }); }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; return NextResponse.json({ option: await saveCakeWeightOption(id, null, await request.json()) }, { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save weight option." }, { status: 400 }); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; const body = await request.json(); return NextResponse.json({ option: await saveCakeWeightOption(id, body.id, body) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save weight option." }, { status: 400 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; const body = await request.json(); await deleteCakeWeightOption(id, body.id); return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to remove weight option." }, { status: 400 }); }
}

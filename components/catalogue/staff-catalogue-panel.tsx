"use client";

import { useState } from "react";
import type { StaffCatalogueCake, StaffCatalogueCategory } from "@/services/staff-catalogue";

type Notice = { tone: "success" | "error"; text: string } | null;
type CakeForm = Omit<StaffCatalogueCake, "id" | "categoryName" | "categorySlug" | "basePrice" | "salePrice"> & {
  basePrice: string;
  salePrice: string;
  categoryId: string;
};
type CategoryForm = { name: string; description: string; displayPriority: string };

function formatMoney(value: number) {
  return `₹${value.toFixed(2)}`;
}

function toCakeForm(cake: StaffCatalogueCake, categories: StaffCatalogueCategory[]): CakeForm {
  return {
    ...cake,
    basePrice: String(cake.basePrice),
    salePrice: cake.salePrice === null ? "" : String(cake.salePrice),
    categoryId: categories.find((category) => category.slug === cake.categorySlug)?.id ?? "",
  };
}

function emptyCakeForm(categories: StaffCatalogueCategory[]): CakeForm {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: null,
    basePrice: "",
    salePrice: "",
    categoryId: categories.find((category) => category.isActive)?.id ?? "",
    availability: "available",
    isActive: true,
    isFeatured: false,
    displayPriority: 0,
    seoTitle: null,
    seoDescription: null,
  };
}

function toCategoryForm(category?: StaffCatalogueCategory): CategoryForm {
  return {
    name: category?.name ?? "",
    description: category?.description ?? "",
    displayPriority: String(category?.displayPriority ?? 0),
  };
}

async function readResult<T>(response: Response) {
  const result = await response.json() as { error?: string } & T;
  if (!response.ok) throw new Error(result.error ?? "The catalogue request failed.");
  return result;
}

export function StaffCataloguePanel({
  initialCakes,
  initialCategories,
}: {
  initialCakes: StaffCatalogueCake[];
  initialCategories: StaffCatalogueCategory[];
}) {
  const [cakes, setCakes] = useState(initialCakes);
  const [categories, setCategories] = useState(initialCategories);
  const [editingCake, setEditingCake] = useState<string | null>(null);
  const [creatingCake, setCreatingCake] = useState(false);
  const [cakeForm, setCakeForm] = useState<CakeForm | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(toCategoryForm());
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);

  async function saveCake(event: React.FormEvent) {
    event.preventDefault();
    if (!cakeForm || (!editingCake && !creatingCake)) return;
    setBusy(true);
    setNotice(null);
    try {
      const createValues = { ...cakeForm, slug: undefined };
      const response = await fetch(creatingCake ? "/api/admin/catalogue" : `/api/admin/catalogue/${editingCake}`, {
        method: creatingCake ? "POST" : "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...(creatingCake ? createValues : { ...cakeForm }),
          basePrice: Number(cakeForm.basePrice),
          salePrice: cakeForm.salePrice === "" ? null : Number(cakeForm.salePrice),
          fullDescription: cakeForm.fullDescription || null,
          seoTitle: cakeForm.seoTitle || null,
          seoDescription: cakeForm.seoDescription || null,
        }),
      });
      const result = await readResult<{ cake?: StaffCatalogueCake }>(response);
      if (!result.cake) throw new Error("The updated product was not returned.");
      setCakes((current) => creatingCake
        ? [...current, result.cake as StaffCatalogueCake].sort((a, b) => a.displayPriority - b.displayPriority || a.name.localeCompare(b.name))
        : current.map((cake) => cake.id === editingCake ? result.cake as StaffCatalogueCake : cake));
      setEditingCake(null);
      setCreatingCake(false);
      setCakeForm(null);
      setNotice({ tone: "success", text: creatingCake ? "Product created." : "Product updated." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to update the product." });
    } finally {
      setBusy(false);
    }
  }

  async function saveCategory(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(
        editingCategory ? `/api/admin/catalogue/categories/${editingCategory}` : "/api/admin/catalogue/categories",
        {
          method: editingCategory ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: categoryForm.name,
            description: categoryForm.description || null,
            displayPriority: Number(categoryForm.displayPriority),
          }),
        },
      );
      const result = await readResult<{ category?: StaffCatalogueCategory }>(response);
      if (!result.category) throw new Error("The updated category was not returned.");
      setCategories((current) => {
        const next = editingCategory
          ? current.map((category) => category.id === editingCategory ? result.category as StaffCatalogueCategory : category)
          : [...current, result.category as StaffCatalogueCategory];
        return next.sort((a, b) => a.displayPriority - b.displayPriority || a.name.localeCompare(b.name));
      });
      setEditingCategory(null);
      setCategoryForm(toCategoryForm());
      setNotice({ tone: "success", text: editingCategory ? "Category updated." : "Category created." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to save the category." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container space-y-8 py-16 md:py-24">
      <section className="surface-card mx-auto max-w-6xl p-6 md:p-8">
        <p className="eyebrow">Catalogue</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Product management</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Select a product to edit its existing catalogue content, pricing, category, availability, visibility, and merchandising fields.
        </p>
        <button type="button" className="button button--primary mt-6" onClick={() => { setCreatingCake(true); setEditingCake(null); setCakeForm(emptyCakeForm(categories)); setNotice(null); }}>Add cake</button>
        {notice ? <p className={`mt-5 rounded-md border p-3 text-sm font-medium ${notice.tone === "success" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700" : "border-destructive/40 bg-destructive/5 text-destructive"}`} role="alert">{notice.text}</p> : null}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <tr>{["Product", "Category", "Price", "State", "Merchandising", "Action"].map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cakes.map((cake) => (
                <tr key={cake.id}>
                  <td className="px-3 py-4"><p className="font-semibold">{cake.name}</p><p className="text-xs text-muted-foreground">/{cake.slug}</p></td>
                  <td className="px-3 py-4 text-muted-foreground">{cake.categoryName}</td>
                  <td className="px-3 py-4">{formatMoney(cake.salePrice ?? cake.basePrice)}</td>
                  <td className="px-3 py-4">{cake.isActive ? "Active" : "Inactive"} / {cake.availability}</td>
                  <td className="px-3 py-4">{cake.isFeatured ? "Featured" : "Standard"} / priority {cake.displayPriority}</td>
                  <td className="px-3 py-4 text-right"><button type="button" className="button button--secondary text-xs" onClick={() => { setCreatingCake(false); setEditingCake(cake.id); setCakeForm(toCakeForm(cake, categories)); }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(editingCake || creatingCake) && cakeForm ? (
        <section className="surface-card mx-auto max-w-6xl p-6 md:p-8">
          <h2 className="text-xl font-semibold">{creatingCake ? "Add cake" : "Edit product"}</h2>
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={(event) => void saveCake(event)}>
            <label className="grid gap-2 text-sm font-medium">Name<input required className="input" value={cakeForm.name} onChange={(event) => setCakeForm({ ...cakeForm, name: event.target.value })} /></label>
            {!creatingCake ? <label className="grid gap-2 text-sm font-medium">Slug<input required className="input" value={cakeForm.slug} onChange={(event) => setCakeForm({ ...cakeForm, slug: event.target.value })} /></label> : <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">The product slug will be generated from the name when saved.</p>}
            <label className="grid gap-2 text-sm font-medium md:col-span-2">Short description<textarea required className="input min-h-20" value={cakeForm.shortDescription} onChange={(event) => setCakeForm({ ...cakeForm, shortDescription: event.target.value })} /></label>
            <label className="grid gap-2 text-sm font-medium md:col-span-2">Full description<textarea className="input min-h-28" value={cakeForm.fullDescription ?? ""} onChange={(event) => setCakeForm({ ...cakeForm, fullDescription: event.target.value })} /></label>
            <label className="grid gap-2 text-sm font-medium">Base price<input required className="input" type="number" min="0" step="0.01" value={cakeForm.basePrice} onChange={(event) => setCakeForm({ ...cakeForm, basePrice: event.target.value })} /></label>
            <label className="grid gap-2 text-sm font-medium">Sale price<input className="input" type="number" min="0" step="0.01" value={cakeForm.salePrice} onChange={(event) => setCakeForm({ ...cakeForm, salePrice: event.target.value })} /></label>
            <label className="grid gap-2 text-sm font-medium">Category<select required className="input" value={cakeForm.categoryId} onChange={(event) => setCakeForm({ ...cakeForm, categoryId: event.target.value })}>{categories.filter((category) => category.isActive).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-medium">Availability<select className="input" value={cakeForm.availability} onChange={(event) => setCakeForm({ ...cakeForm, availability: event.target.value as "available" | "unavailable" })}><option value="available">Available</option><option value="unavailable">Unavailable</option></select></label>
            <label className="grid gap-2 text-sm font-medium">Display priority<input required className="input" type="number" min="0" value={cakeForm.displayPriority} onChange={(event) => setCakeForm({ ...cakeForm, displayPriority: Number(event.target.value) })} /></label>
            <label className="grid gap-2 text-sm font-medium">SEO title<input className="input" value={cakeForm.seoTitle ?? ""} onChange={(event) => setCakeForm({ ...cakeForm, seoTitle: event.target.value })} /></label>
            <label className="grid gap-2 text-sm font-medium md:col-span-2">SEO description<textarea className="input min-h-20" value={cakeForm.seoDescription ?? ""} onChange={(event) => setCakeForm({ ...cakeForm, seoDescription: event.target.value })} /></label>
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={cakeForm.isActive} onChange={(event) => setCakeForm({ ...cakeForm, isActive: event.target.checked })} /> Active on public catalogue</label>
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={cakeForm.isFeatured} onChange={(event) => setCakeForm({ ...cakeForm, isFeatured: event.target.checked })} /> Featured product</label>
            <div className="flex gap-3 md:col-span-2"><button className="button button--primary" disabled={busy}>{busy ? "Saving..." : creatingCake ? "Create cake" : "Save product"}</button><button type="button" className="button button--secondary" onClick={() => { setCreatingCake(false); setEditingCake(null); setCakeForm(null); }}>Cancel</button></div>
          </form>
        </section>
      ) : null}

      <section className="surface-card mx-auto max-w-6xl p-6 md:p-8">
        <h2 className="text-xl font-semibold">Categories</h2>
        <p className="mt-2 text-sm text-muted-foreground">Create and edit category metadata and ordering. Deactivation remains deferred until its database and cart behavior are coordinated.</p>
        <form className="mt-6 grid gap-4 md:grid-cols-4" onSubmit={(event) => void saveCategory(event)}>
          <label className="grid gap-2 text-sm font-medium">Name<input required className="input" value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">Description<input className="input" value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} /></label>
          <label className="grid gap-2 text-sm font-medium">Priority<input required className="input" type="number" min="0" value={categoryForm.displayPriority} onChange={(event) => setCategoryForm({ ...categoryForm, displayPriority: event.target.value })} /></label>
          <div className="flex gap-3 md:col-span-4"><button className="button button--primary" disabled={busy}>{busy ? "Saving..." : editingCategory ? "Save category" : "Create category"}</button>{editingCategory ? <button type="button" className="button button--secondary" onClick={() => { setEditingCategory(null); setCategoryForm(toCategoryForm()); }}>Cancel</button> : null}</div>
        </form>
        <div className="mt-6 divide-y divide-border">
          {categories.map((category) => <div key={category.id} className="flex items-center justify-between gap-4 py-3 text-sm"><span><strong>{category.name}</strong> <span className="text-muted-foreground">/{category.slug} · priority {category.displayPriority}</span>{category.description ? <span className="ml-2 text-muted-foreground">— {category.description}</span> : null}</span><span className="flex items-center gap-3"><span className="text-muted-foreground">{category.isActive ? "Active" : "Inactive"}</span><button type="button" className="button button--secondary text-xs" onClick={() => { setEditingCategory(category.id); setCategoryForm(toCategoryForm(category)); }}>Edit</button></span></div>)}
        </div>
      </section>
    </div>
  );
}

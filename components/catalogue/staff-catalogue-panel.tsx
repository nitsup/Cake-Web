"use client";

import { useRef, useState } from "react";
import type { StaffCatalogueCake, StaffCatalogueCakeImage, StaffCatalogueCategory } from "@/services/staff-catalogue";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

type Notice = { tone: "success" | "error"; text: string } | null;
type CakeForm = Omit<StaffCatalogueCake, "id" | "categoryName" | "categorySlug" | "basePrice" | "salePrice"> & {
  basePrice: string;
  salePrice: string;
  categoryId: string;
};
type CategoryForm = { name: string; description: string; displayPriority: string };
type WeightOption = { id: string; weight_amount: number; weight_unit: "g" | "kg"; label: string; price: number; is_available: boolean; display_priority: number };

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

function sortMedia(images: StaffCatalogueCakeImage[]) {
  return [...images].sort((a, b) => Number(a.isPrimary) === Number(b.isPrimary) ? a.displayPriority - b.displayPriority : Number(b.isPrimary) - Number(a.isPrimary));
}

async function loadCakeMediaForEdit(cakeId: string, setCakeImages: React.Dispatch<React.SetStateAction<StaffCatalogueCakeImage[]>>, setCakeImageError: React.Dispatch<React.SetStateAction<string | null>>, setCakeImageLoading: React.Dispatch<React.SetStateAction<boolean>>) {
  setCakeImageLoading(true);
  setCakeImageError(null);
  try {
    const response = await fetch(`/api/admin/catalogue/${cakeId}/media`);
    const result = await readResult<{ images?: StaffCatalogueCakeImage[] }>(response);
    setCakeImages(sortMedia(result.images ?? []));
  } catch (error) {
    setCakeImageError(error instanceof Error ? error.message : "Unable to load the product images.");
    setCakeImages([]);
  } finally {
    setCakeImageLoading(false);
  }
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
  const [cakeImages, setCakeImages] = useState<StaffCatalogueCakeImage[]>([]);
  const [cakeImageError, setCakeImageError] = useState<string | null>(null);
  const [cakeImageLoading, setCakeImageLoading] = useState(false);
  const [weightOptions, setWeightOptions] = useState<WeightOption[]>([]);
  const [weightDraft, setWeightDraft] = useState({ weightAmount: "", weightUnit: "g" as "g" | "kg", label: "", price: "", isAvailable: true, displayPriority: "0" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadWeightOptions(cakeId: string) {
    const result = await readResult<{ options?: WeightOption[] }>(await fetch(`/api/admin/catalogue/${cakeId}/weights`));
    setWeightOptions(result.options ?? []);
  }

  async function saveWeightOption(event: React.FormEvent) {
    event.preventDefault();
    if (!editingCake) return;
    try {
      const response = await fetch(`/api/admin/catalogue/${editingCake}/weights`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...weightDraft, weightAmount: Number(weightDraft.weightAmount), price: Number(weightDraft.price), displayPriority: Number(weightDraft.displayPriority) }),
      });
      await readResult(response);
      setWeightDraft({ weightAmount: "", weightUnit: "g", label: "", price: "", isAvailable: true, displayPriority: "0" });
      await loadWeightOptions(editingCake);
      setNotice({ tone: "success", text: "Weight option saved." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to save the weight option." });
    }
  }

  async function toggleWeightOption(option: WeightOption) {
    if (!editingCake) return;
    try {
      const response = await fetch(`/api/admin/catalogue/${editingCake}/weights`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: option.id, weightAmount: option.weight_amount, weightUnit: option.weight_unit, label: option.label, price: option.price, isAvailable: !option.is_available, displayPriority: option.display_priority }) });
      await readResult(response);
      await loadWeightOptions(editingCake);
    } catch (error) { setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to update the weight option." }); }
  }

  async function removeWeightOption(id: string) {
    if (!editingCake) return;
    try {
      const response = await fetch(`/api/admin/catalogue/${editingCake}/weights`, { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
      await readResult(response);
      await loadWeightOptions(editingCake);
    } catch (error) { setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to remove the weight option." }); }
  }

  async function uploadCakeImage(file: File) {
    if (!editingCake) return;
    setCakeImageLoading(true);
    setCakeImageError(null);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch(`/api/admin/catalogue/${editingCake}/media`, { method: "POST", body: formData });
      const result = await readResult<{ image?: StaffCatalogueCakeImage }>(response);
      if (!result.image) throw new Error("The uploaded image was not returned.");
      setCakeImages((current) => sortMedia([...current, result.image as StaffCatalogueCakeImage]));
      setNotice({ tone: "success", text: "Product image uploaded." });
    } catch (error) {
      setCakeImageError(error instanceof Error ? error.message : "Unable to upload the product image.");
    } finally {
      setCakeImageLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function setPrimaryCakeImage(imageId: string) {
    if (!editingCake) return;
    setCakeImageLoading(true);
    setCakeImageError(null);
    try {
      const response = await fetch(`/api/admin/catalogue/${editingCake}/media`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageId }),
      });
      const result = await readResult<{ image?: StaffCatalogueCakeImage }>(response);
      if (!result.image) throw new Error("The primary image update did not return a product image.");
      const nextImage = result.image as StaffCatalogueCakeImage;
      setCakeImages((current) => sortMedia(current.map((image) => {
        if (image.id === nextImage.id) return nextImage;
        return { ...image, isPrimary: false };
      })));
      setNotice({ tone: "success", text: "Primary image updated." });
    } catch (error) {
      setCakeImageError(error instanceof Error ? error.message : "Unable to update the primary image.");
    } finally {
      setCakeImageLoading(false);
    }
  }

  function updateImageDraft(imageId: string, values: Partial<Pick<StaffCatalogueCakeImage, "zoom" | "positionX" | "positionY">>) {
    setCakeImages((current) => current.map((image) => image.id === imageId ? { ...image, ...values } : image));
  }

  async function saveImagePresentation(image: StaffCatalogueCakeImage) {
    if (!editingCake) return;
    setCakeImageLoading(true);
    setCakeImageError(null);
    try {
      const response = await fetch(`/api/admin/catalogue/${editingCake}/media`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          imageId: image.id,
          zoom: image.zoom,
          positionX: image.positionX,
          positionY: image.positionY,
        }),
      });
      const result = await readResult<{ image?: StaffCatalogueCakeImage }>(response);
      if (!result.image) throw new Error("The image positioning update was not returned.");
      setCakeImages((current) => current.map((item) => item.id === image.id ? result.image as StaffCatalogueCakeImage : item));
      setNotice({ tone: "success", text: "Image preview positioning saved." });
    } catch (error) {
      setCakeImageError(error instanceof Error ? error.message : "Unable to save the image positioning.");
    } finally {
      setCakeImageLoading(false);
    }
  }

  async function removeCakeImage(imageId: string) {
    if (!editingCake) return;
    setCakeImageLoading(true);
    setCakeImageError(null);
    try {
      const response = await fetch(`/api/admin/catalogue/${editingCake}/media`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageId }),
      });
      await readResult<{ ok?: boolean }>(response);
      setCakeImages((current) => current.filter((image) => image.id !== imageId));
      setNotice({ tone: "success", text: "Product image removed." });
    } catch (error) {
      setCakeImageError(error instanceof Error ? error.message : "Unable to remove the product image.");
    } finally {
      setCakeImageLoading(false);
    }
  }

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
      const savedCake = result.cake as StaffCatalogueCake;
      setCakes((current) => creatingCake
        ? [...current, savedCake].sort((a, b) => a.displayPriority - b.displayPriority || a.name.localeCompare(b.name))
        : current.map((cake) => cake.id === editingCake ? savedCake : cake));

      if (creatingCake) {
        setCreatingCake(false);
        setEditingCake(savedCake.id);
        setCakeForm(toCakeForm(savedCake, categories));
        setCakeImages([]);
        setNotice({ tone: "success", text: "Product created. Add an image to finish the listing." });
        await loadCakeMediaForEdit(savedCake.id, setCakeImages, setCakeImageError, setCakeImageLoading);
        return;
      }

      setEditingCake(null);
      setCreatingCake(false);
      setCakeForm(null);
      setNotice({ tone: "success", text: "Product updated." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to update the product." });
    } finally {
      setBusy(false);
    }
  }

  async function setCakeArchiveState(nextIsActive: boolean) {
    if (!editingCake) return;
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/catalogue/${editingCake}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          isActive: nextIsActive,
          availability: nextIsActive ? "available" : "unavailable",
        }),
      });
      const result = await readResult<{ cake?: StaffCatalogueCake }>(response);
      const updatedCake = result.cake as StaffCatalogueCake | undefined;
      if (!updatedCake) throw new Error("The archive state was not returned.");
      setCakes((current) => current.map((cake) => cake.id === editingCake ? updatedCake : cake));
      setCakeForm(toCakeForm(updatedCake, categories));
      setNotice({
        tone: "success",
        text: nextIsActive ? "Product restored and made public again." : "Product archived and removed from the public catalogue.",
      });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Unable to change the product state." });
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
                  <td className="px-3 py-4 text-right"><button type="button" className="button button--secondary text-xs" onClick={async () => { setCreatingCake(false); setEditingCake(cake.id); setCakeForm(toCakeForm(cake, categories)); setCakeImages([]); await Promise.all([loadCakeMediaForEdit(cake.id, setCakeImages, setCakeImageError, setCakeImageLoading), loadWeightOptions(cake.id)]); }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(editingCake || creatingCake) && cakeForm ? (
        <section className="surface-card mx-auto max-w-6xl p-6 md:p-8">
          <h2 className="text-xl font-semibold">{creatingCake ? "Add cake" : "Edit product"}</h2>
          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,380px)]">
            <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => void saveCake(event)}>
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
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button className="button button--primary" disabled={busy}>{busy ? "Saving..." : creatingCake ? "Create cake" : "Save product"}</button>
                {editingCake ? (
                  <button type="button" className="button button--secondary" onClick={() => void setCakeArchiveState(!cakeForm.isActive)} disabled={busy}>
                    {cakeForm.isActive ? "Archive product" : "Restore product"}
                  </button>
                ) : null}
                <button type="button" className="button button--secondary" onClick={() => { setCreatingCake(false); setEditingCake(null); setCakeForm(null); setCakeImages([]); }}>Cancel</button>
              </div>
            </form>

            <aside className="xl:pt-1">
              {editingCake ? <div className="mb-6 rounded-xl border border-border bg-background/60 p-4">
                <h3 className="text-lg font-semibold">Weight options</h3>
                <p className="mt-1 text-xs text-muted-foreground">Customers must choose an available option before adding this cake.</p>
                <div className="mt-3 space-y-2">{weightOptions.map((option) => <div key={option.id} className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm"><span>{option.label} · {formatMoney(Number(option.price))}</span><span className="flex gap-2"><button type="button" className="button button--ghost text-xs" onClick={() => void toggleWeightOption(option)}>{option.is_available ? "Disable" : "Enable"}</button><button type="button" className="button button--ghost text-xs" onClick={() => void removeWeightOption(option.id)}>Remove</button></span></div>)}</div>
                <form className="mt-4 grid gap-2" onSubmit={(event) => void saveWeightOption(event)}>
                  <div className="grid grid-cols-2 gap-2"><input required type="number" min="0.001" step="0.001" placeholder="Amount" className="input" value={weightDraft.weightAmount} onChange={(event) => setWeightDraft({ ...weightDraft, weightAmount: event.target.value })} /><select className="input" value={weightDraft.weightUnit} onChange={(event) => setWeightDraft({ ...weightDraft, weightUnit: event.target.value as "g" | "kg" })}><option value="g">g</option><option value="kg">kg</option></select></div>
                  <input required placeholder="Customer label" className="input" value={weightDraft.label} onChange={(event) => setWeightDraft({ ...weightDraft, label: event.target.value })} />
                  <input required type="number" min="0" step="0.01" placeholder="Selling price" className="input" value={weightDraft.price} onChange={(event) => setWeightDraft({ ...weightDraft, price: event.target.value })} />
                  <input required type="number" min="0" step="1" placeholder="Display order" className="input" value={weightDraft.displayPriority} onChange={(event) => setWeightDraft({ ...weightDraft, displayPriority: event.target.value })} />
                  <button className="button button--secondary text-xs">Add weight option</button>
                </form>
              </div> : null}
              <div className="sticky top-4 rounded-xl border border-border bg-background/60 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">Product media</h3>
                    <p className="text-xs text-muted-foreground">Primary image, upload, replacement, and deletion</p>
                  </div>
                  {editingCake ? <button type="button" className="button button--secondary text-xs" onClick={() => fileInputRef.current?.click()} disabled={cakeImageLoading}>Add image</button> : null}
                </div>

                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadCakeImage(file); }} />
                {cakeImageError ? <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive" role="alert">{cakeImageError}</p> : null}
                {cakeImageLoading && cakeImages.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Loading product media…</p> : null}

                <div className="mt-4 overflow-hidden rounded-lg border border-border bg-muted/20">
                  {editingCake && cakeImages.some((image) => image.isPrimary) ? (
                    <ImagePlaceholder src={cakeImages.find((image) => image.isPrimary)?.url ?? null} alt={cakeImages.find((image) => image.isPrimary)?.altText ?? "Cake product image"} zoom={cakeImages.find((image) => image.isPrimary)?.zoom} positionX={cakeImages.find((image) => image.isPrimary)?.positionX} positionY={cakeImages.find((image) => image.isPrimary)?.positionY} className="h-64 w-full object-cover" priority />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-muted/20 px-4 text-center text-sm text-muted-foreground">
                      {editingCake ? "No product image uploaded yet." : "Image upload becomes available after saving the cake."}
                    </div>
                  )}
                </div>

                {editingCake ? (
                  <div className="mt-4 space-y-3">
                    {cakeImages.length > 0 ? cakeImages.map((image) => (
                      <div key={image.id} className="rounded-lg border border-border bg-background/40 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{image.isPrimary ? "Primary" : "Secondary"}</span>
                          {!image.isPrimary ? <button type="button" className="button button--ghost text-xs" onClick={() => void setPrimaryCakeImage(image.id)} disabled={cakeImageLoading}>Set primary</button> : null}
                        </div>
                        <div className="mt-2 overflow-hidden rounded-md border border-border bg-muted/20">
                          {image.url ? <ImagePlaceholder src={image.url} alt={image.altText} zoom={image.zoom} positionX={image.positionX} positionY={image.positionY} className="h-24 w-full object-cover" /> : <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">Image unavailable</div>}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{image.altText}</p>
                        <label className="mt-3 grid gap-1 text-xs font-medium">
                          Zoom: {image.zoom.toFixed(2)}x
                          <input type="range" min="1" max="3" step="0.05" value={image.zoom} onChange={(event) => updateImageDraft(image.id, { zoom: Number(event.target.value) })} />
                        </label>
                        <label className="mt-2 grid gap-1 text-xs font-medium">
                          Horizontal position: {Math.round(image.positionX)}%
                          <input type="range" min="0" max="100" step="1" value={image.positionX} onChange={(event) => updateImageDraft(image.id, { positionX: Number(event.target.value) })} />
                        </label>
                        <label className="mt-2 grid gap-1 text-xs font-medium">
                          Vertical position: {Math.round(image.positionY)}%
                          <input type="range" min="0" max="100" step="1" value={image.positionY} onChange={(event) => updateImageDraft(image.id, { positionY: Number(event.target.value) })} />
                        </label>
                        <button type="button" className="button button--primary mt-3 w-full text-xs" onClick={() => void saveImagePresentation(image)} disabled={cakeImageLoading}>Save image view</button>
                        <button type="button" className="button button--secondary mt-3 w-full text-xs" onClick={() => void removeCakeImage(image.id)} disabled={cakeImageLoading}>Remove image</button>
                      </div>
                    )) : !cakeImageLoading ? <p className="rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground">No product images yet. Add a main photograph for this cake.</p> : null}
                  </div>
                ) : null}
              </div>
            </aside>
          </div>

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

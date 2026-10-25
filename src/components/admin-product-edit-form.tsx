"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle, Save, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = { id: string; name: string };
type ProductData = {
  id: string; name: string; slug: string; sku: string | null; description: string | null;
  price: string; comparePrice: string | null; stock: number; imageUrl: string | null;
  categoryId: string | null; isFeatured: boolean; isActive: boolean;
};

export function AdminProductEditForm({ product, categories }: { product: ProductData; categories: Category[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(product.imageUrl || "");
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function previewFile(file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function upload(file: File) {
    const data = new FormData();
    data.append("file", file);
    const response = await fetch("/api/admin/uploads/product-image", { method: "POST", body: data });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Image upload failed.");
    return result.imageUrl as string;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      let finalImage = imageUrl;
      const file = inputRef.current?.files?.[0];
      if (file) finalImage = await upload(file);

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"), slug: form.get("slug"), sku: form.get("sku"), description: form.get("description"),
          price: Number(form.get("price")), comparePrice: form.get("comparePrice") ? Number(form.get("comparePrice")) : null,
          stock: Number(form.get("stock")), categoryId: form.get("categoryId") || null, imageUrl: finalImage || null,
          isFeatured: form.get("isFeatured") === "on", isActive: form.get("isActive") === "on",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update product.");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not update product.");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
        <p className="font-semibold">Product image</p>
        <div className="aspect-square overflow-hidden rounded-2xl border border-dashed border-rose-200 bg-rose-50">
          {preview ? <img src={preview} alt="Product preview" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><ImagePlus className="h-12 w-12 text-rose-300" /></div>}
        </div>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
          <UploadCloud className="h-4 w-4" /> Replace image
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => previewFile(e.target.files?.[0])} />
        </label>
      </div>

      <div className="grid gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm sm:grid-cols-2">
        <div className="space-y-2"><label className="text-sm font-medium">Product name</label><Input name="name" defaultValue={product.name} required /></div>
        <div className="space-y-2"><label className="text-sm font-medium">Slug</label><Input name="slug" defaultValue={product.slug} required /></div>
        <div className="space-y-2"><label className="text-sm font-medium">SKU</label><Input name="sku" defaultValue={product.sku || ""} /></div>
        <div className="space-y-2"><label className="text-sm font-medium">Category</label><select name="categoryId" defaultValue={product.categoryId || ""} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm"><option value="">No category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div className="space-y-2"><label className="text-sm font-medium">Price</label><Input name="price" type="number" min="0" step="0.01" defaultValue={product.price} required /></div>
        <div className="space-y-2"><label className="text-sm font-medium">Compare price</label><Input name="comparePrice" type="number" min="0" step="0.01" defaultValue={product.comparePrice || ""} /></div>
        <div className="space-y-2"><label className="text-sm font-medium">Stock</label><Input name="stock" type="number" min="0" defaultValue={product.stock} required /></div>
        <div className="flex items-end gap-5 pb-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} /> Featured</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={product.isActive} /> Active</label></div>
        <div className="space-y-2 sm:col-span-2"><label className="text-sm font-medium">Description</label><textarea name="description" defaultValue={product.description || ""} rows={5} className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-rose-200" /></div>
        {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2"><Button disabled={busy} className="gap-2 bg-rose-500 hover:bg-rose-600">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{busy ? "Saving..." : "Save changes"}</Button></div>
      </div>
    </form>
  );
}

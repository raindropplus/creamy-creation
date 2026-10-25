"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = { id: string; name: string };

export function AdminProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  async function uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/uploads/product-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not upload product image.");
    }

    return data.imageUrl as string;
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const imageFile = form.get("image") as File | null;
    let resolvedImageUrl = imageUrl;

    try {
      if (imageFile && imageFile.size > 0) {
        setUploading(true);
        resolvedImageUrl = await uploadProductImage(imageFile);
        setImageUrl(resolvedImageUrl);
        setUploading(false);
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          slug: form.get("slug"),
          sku: form.get("sku"),
          categoryId: form.get("categoryId"),
          price: Number(form.get("price")),
          comparePrice: form.get("comparePrice") ? Number(form.get("comparePrice")) : undefined,
          stock: Number(form.get("stock")),
          description: form.get("description"),
          imageUrl: resolvedImageUrl || null,
          isFeatured: form.get("isFeatured") === "on",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not create product.");
      }

      e.currentTarget.reset();
      setImageUrl("");
      setPreviewUrl("");
      setSuccess("Product created successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create product.");
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Product name</label>
        <Input name="name" placeholder="Chocolate Dream Cake" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Slug</label>
        <Input name="slug" placeholder="chocolate-dream-cake" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">SKU</label>
        <Input name="sku" placeholder="CC-001" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Category</label>
        <select name="categoryId" className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm">
          <option value="">No category</option>
          {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Price</label>
        <Input name="price" type="number" step="0.01" min="0" placeholder="950" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Compare at price</label>
        <Input name="comparePrice" type="number" step="0.01" min="0" placeholder="1100" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Stock</label>
        <Input name="stock" type="number" min="0" placeholder="15" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Product image</label>
        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-dashed border-rose-200 px-3 text-sm text-zinc-600 transition hover:border-rose-300 hover:bg-rose-50/60">
          <UploadCloud className="h-4 w-4 text-rose-500" />
          <span>Choose image</span>
          <input name="image" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { const file=e.target.files?.[0]; if (file) setPreviewUrl(URL.createObjectURL(file)); }} />
        </label>
      </div>
      <div className="space-y-2 sm:col-span-2 lg:col-span-3">
        <label className="text-sm font-medium text-zinc-700">Description</label>
        <Input name="description" placeholder="Soft sponge cake with a premium creamy finish." />
      </div>
      <div className="flex items-end">
        <label className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm">
          <input type="checkbox" name="isFeatured" />
          Featured product
        </label>
      </div>
      <div className="sm:col-span-2 lg:col-span-4">
        {previewUrl || imageUrl ? (
          <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/60 p-3 text-sm text-zinc-700">
            <img src={previewUrl || imageUrl} alt="Product preview" className="h-16 w-16 rounded-lg object-cover" />
            <div>
              <p className="font-medium">Image preview</p>
              <p className="text-xs text-zinc-500">Your product image will be saved in the project public folder.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-500">
            <ImagePlus className="h-4 w-4" />
            Upload a JPG, PNG, or WEBP image for this product.
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
        <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={uploading || submitting}>
          {(uploading || submitting) && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {uploading ? "Uploading image..." : submitting ? "Creating product..." : "Create product"}
        </Button>
        {success && <p className="text-sm text-emerald-600">{success}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </form>
  );
}

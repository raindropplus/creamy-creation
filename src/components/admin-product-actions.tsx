"use client";

import { useState } from "react";
import Link from "next/link";
import { Archive, Edit3, LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminProductActions({ productId, archived }: { productId: string; archived: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function archive() {
    if (!confirm(archived ? "Restore this product?" : "Archive this product?")) return;
    setBusy(true);
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: archived }),
    });
    setBusy(false);
    router.refresh();
  }

  async function permanentlyDelete() {
    if (!confirm("Permanently delete this product? This is only allowed when it has never been ordered.")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/products/${productId}?permanent=true`, { method: "DELETE" });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) return alert(data.error || "Could not delete product.");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/products/${productId}/edit`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold transition hover:bg-zinc-50">
        <Edit3 className="h-3.5 w-3.5" /> Edit
      </Link>
      <button type="button" onClick={archive} disabled={busy} className="inline-flex h-9 items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50">
        {busy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Archive className="h-3.5 w-3.5" />} {archived ? "Restore" : "Archive"}
      </button>
      <button type="button" onClick={permanentlyDelete} disabled={busy} className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </div>
  );
}

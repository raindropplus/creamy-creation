"use client";

import { useState } from "react";
import { LoaderCircle, Minus, Plus, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminStockControl({ productId, stock }: { productId: string; stock: number }) {
  const router = useRouter();
  const [value, setValue] = useState(stock);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const response = await fetch(`/api/admin/products/${productId}/stock`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stock: value }),
    });
    setBusy(false);
    if (!response.ok) return;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setValue((v) => Math.max(0, v - 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white hover:bg-zinc-50"><Minus className="h-4 w-4" /></button>
      <input value={value} onChange={(e) => setValue(Math.max(0, Number(e.target.value || 0)))} type="number" min="0" className="h-9 w-20 rounded-lg border border-zinc-200 px-2 text-center text-sm font-semibold" />
      <button onClick={() => setValue((v) => v + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white hover:bg-zinc-50"><Plus className="h-4 w-4" /></button>
      <button onClick={save} disabled={busy || value === stock} className="flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-white disabled:opacity-40">{busy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}Save</button>
    </div>
  );
}

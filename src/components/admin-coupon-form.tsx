"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminCouponForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Could not create coupon");
    e.currentTarget.reset();
    setError("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
      <Input name="code" placeholder="SAVE10" required />
      <Input name="percentOff" type="number" min="1" max="100" placeholder="% off" />
      <Input name="amountOff" type="number" min="0" step="0.01" placeholder="Amount off" />
      <Input name="minimumOrder" type="number" min="0" step="0.01" placeholder="Minimum order" />
      <Input name="usageLimit" type="number" min="1" placeholder="Usage limit" />
      <div><Button>Create coupon</Button></div>
      {error && <p className="text-sm text-red-600 sm:col-span-2 lg:col-span-4">{error}</p>}
    </form>
  );
}

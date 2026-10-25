"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearCart, getCart } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const items = getCart();

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        couponCode: form.get("couponCode"),
        paymentMethod: form.get("paymentMethod"),
        shippingAddress: {
          name: form.get("name"),
          phone: form.get("phone"),
          line1: form.get("line1"),
          line2: form.get("line2"),
          city: form.get("city"),
          state: form.get("state"),
          postalCode: form.get("postalCode"),
          country: form.get("country"),
        },
        customerNote: form.get("note"),
      }),
    });

    const data = await response.json();
    setBusy(false);

    if (response.status === 401) {
      router.push("/login");
      return;
    }

    if (!response.ok) return setError(data.error || "Checkout failed");

    clearCart();
    router.push(`/account/orders?placed=${encodeURIComponent(data.orderNumber)}`);
    router.refresh();
  }

  return (
    <main className="container-app max-w-3xl py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-zinc-500">Enter delivery and payment information.</p>

      <form className="mt-8 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2" onSubmit={submit}>
        <Input name="name" placeholder="Recipient name" required />
        <Input name="phone" placeholder="+8801..." required />
        <Input className="sm:col-span-2" name="line1" placeholder="Address line 1" required />
        <Input className="sm:col-span-2" name="line2" placeholder="Address line 2" />
        <Input name="city" placeholder="City" required />
        <Input name="state" placeholder="State / Division" />
        <Input name="postalCode" placeholder="Postal code" />
        <Input name="country" placeholder="Country" defaultValue="Bangladesh" required />
        <Input name="couponCode" placeholder="Coupon code" />
        <select name="paymentMethod" defaultValue="COD" className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm">
          <option value="COD">Cash on delivery</option>
          <option value="STRIPE">Stripe (integration hook)</option>
          <option value="SSLCOMMERZ">SSLCommerz (integration hook)</option>
        </select>
        <Input className="sm:col-span-2" name="note" placeholder="Order note (optional)" />
        {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
        <Button className="sm:col-span-2" disabled={busy}>
          {busy ? "Placing order..." : "Confirm order"}
        </Button>
      </form>
    </main>
  );
}

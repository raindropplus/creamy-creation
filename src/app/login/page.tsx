"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CakeSlice } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: form.get("identifier"),
        password: form.get("password"),
      }),
    });

    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }

    router.push(data.role === "ADMIN" ? "/admin" : "/account/orders");
    router.refresh();
  }

  return (
    <main className="container-app flex min-h-[78vh] items-center justify-center py-12">
      <Card className="w-full max-w-md overflow-hidden border-rose-100 shadow-xl shadow-rose-100/40">
        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 px-6 py-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <CakeSlice className="h-6 w-6 text-rose-500" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
            Creamy Creation By Alpona
          </p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in with your email or mobile number.</p>
        </div>

        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={submit}>
            <Input
              name="identifier"
              type="text"
              placeholder="Email or mobile number"
              autoComplete="username"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
            />
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            <Button className="w-full" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-zinc-500">
            New customer?{" "}
            <Link href="/register" className="font-semibold text-zinc-900 underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

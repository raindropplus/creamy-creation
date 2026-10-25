"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CakeSlice, Mail, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        identifier: form.get("identifier"),
        password: form.get("password"),
      }),
    });

    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setError(data.error || "Could not create account.");
      return;
    }

    router.push("/products");
    router.refresh();
  }

  return (
    <main className="container-app flex min-h-[78vh] items-center justify-center py-12">
      <Card className="w-full max-w-md overflow-hidden border-rose-100 shadow-xl shadow-rose-100/40">
        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 px-6 py-7 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <CakeSlice className="h-6 w-6 text-rose-500" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
            Creamy Creation By Alpona
          </p>
          <h1 className="mt-2 text-2xl font-bold text-zinc-900">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Register with either your email address or mobile number.
          </p>
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Customer details</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input name="name" placeholder="Full name" className="pl-9" required />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                name="identifier"
                type="text"
                placeholder="Email or mobile number"
                className="pl-9"
                autoComplete="username"
                required
              />
            </div>

            <p className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Phone className="h-3.5 w-3.5" />
              Bangladesh mobile numbers like 017XXXXXXXX are accepted automatically.
            </p>

            <Input
              name="password"
              type="password"
              placeholder="Password (8+ characters)"
              minLength={8}
              autoComplete="new-password"
              required
            />

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <Button className="w-full" disabled={busy}>
              {busy ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-zinc-900 underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

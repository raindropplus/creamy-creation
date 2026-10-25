"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminCategoryForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Could not create category");
    e.currentTarget.reset();
    setError("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex max-w-xl gap-3">
      <Input name="name" placeholder="Category name" required />
      <Input name="slug" placeholder="category-slug" required />
      <Button>Create</Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

"use client";

export type CartItem = {
  productId: string;
  quantity: number;
  name?: string;
  price?: string;
  imageUrl?: string | null;
  stock?: number;
};

const CART_KEY = "cart";
const CART_EVENT = "cart-updated";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function subscribeToCart(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CART_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CART_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find((cartItem) => cartItem.productId === item.productId);

  if (existing) {
    existing.quantity += item.quantity;
    existing.name = item.name ?? existing.name;
    existing.price = item.price ?? existing.price;
    existing.imageUrl = item.imageUrl ?? existing.imageUrl;
    existing.stock = item.stock ?? existing.stock;
  } else {
    cart.push(item);
  }

  setCart(cart);
}

export function updateCartQuantity(productId: string, quantity: number) {
  const cart = getCart()
    .map((item) => item.productId === productId ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0);

  setCart(cart);
}

export function removeFromCart(productId: string) {
  setCart(getCart().filter((item) => item.productId !== productId));
}

export function clearCart() {
  setCart([]);
}

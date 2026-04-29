"use client";

const STORAGE_KEY = "nextup:coins";

export function getStoredNextCoins(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function setStoredNextCoins(value: number) {
  if (typeof window === "undefined") return;
  const normalized = Math.max(0, Math.floor(value));
  window.localStorage.setItem(STORAGE_KEY, normalized.toString());
}

export function addNextCoins(amount: number) {
  if (typeof window === "undefined") return;
  const current = getStoredNextCoins();
  const updated = Math.max(0, current + Math.floor(amount));
  window.localStorage.setItem(STORAGE_KEY, updated.toString());
  window.dispatchEvent(
    new CustomEvent("nextcoins:add", {
      detail: { balance: updated, amount },
    })
  );
}


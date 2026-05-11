// NextCoins utility — now backed by the backend API.
// The coin_balance is stored in the student profile on the server.
// This module provides reactive event helpers for UI updates.

// Event system for real-time UI reactivity
const COIN_CHANGE_EVENT = "nextup:coinChange";

export function emitCoinChange(balance: number) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COIN_CHANGE_EVENT, { detail: { balance } }));
  }
}

export function onCoinChange(callback: (balance: number) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const event = e as CustomEvent;
    callback(event.detail.balance);
  };

  window.addEventListener(COIN_CHANGE_EVENT, handler);
  return () => window.removeEventListener(COIN_CHANGE_EVENT, handler);
}

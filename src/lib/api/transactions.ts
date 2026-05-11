// Transactions API module

import api from "./client";
import type { Transaction } from "@/types";

// GET /transactions — list all transactions for the authenticated user
export async function listTransactions(): Promise<{ transactions: Transaction[] }> {
  return api.get("/transactions");
}

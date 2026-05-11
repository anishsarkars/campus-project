"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import * as transactionsApi from "@/lib/api/transactions";
import { Coins, ArrowUpRight, ArrowDownLeft, Repeat2 } from "lucide-react";
import type { Transaction, StudentProfile } from "@/types";

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/auth");
  }, [authLoading, isAuthenticated, router]);

  const fetch = useCallback(async () => {
    try {
      const data = await transactionsApi.listTransactions();
      setTransactions(data.transactions || []);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetch();
  }, [isAuthenticated, fetch]);

  const myProfileId = profile?._id;
  const coinBalance = profile && "coin_balance" in profile ? (profile as StudentProfile).coin_balance ?? 0 : 0;

  if (authLoading || !isAuthenticated) {
    return <div className="container mx-auto px-4 py-12 flex justify-center"><div className="w-8 h-8 border-3 border-[#ef4d23]/20 border-t-[#ef4d23] rounded-full animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <Coins className="w-6 h-6 text-amber-500" />
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>

      {/* Balance Card */}
      <Card className="mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50">
        <CardContent className="py-6 text-center">
          <p className="text-sm text-amber-700/70 font-medium mb-1">Current Balance</p>
          <p className="text-4xl font-bold text-amber-700 flex items-center justify-center gap-2">
            <Coins className="w-8 h-8" /> {coinBalance}
          </p>
          <p className="text-xs text-amber-600/50 mt-1">NextCoins</p>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-[#ef4d23]/20 border-t-[#ef4d23] rounded-full animate-spin" /></div>
      ) : transactions.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <Repeat2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No transactions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const senderId = typeof tx.sender.id === "string" ? tx.sender.id : (tx.sender.id as any)?._id;
            const isSender = senderId === myProfileId;

            return (
              <Card key={tx._id} className="rounded-xl">
                <CardContent className="py-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSender ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                    {isSender ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{isSender ? "Sent" : "Received"} {tx.amount} coins</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] capitalize">{tx.reason}</Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${isSender ? "text-red-500" : "text-green-500"}`}>
                    {isSender ? "-" : "+"}{tx.amount}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Repeat2, Plus, Search, Coins, Check, Star, ArrowRightLeft, Users, Clock } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useAuth } from "@/contexts/auth-context";
import * as skillswapApi from "@/lib/api/skillswap";
import { toast } from "sonner";
import type { Skillswap, StudentProfile, ApiError } from "@/types";

const statusColors: Record<string, string> = {
  open: "bg-green-500/10 text-green-600 border-green-200",
  accepted: "bg-blue-500/10 text-blue-600 border-blue-200",
  completed: "bg-neutral-500/10 text-neutral-600 border-neutral-200",
};

const dummySwaps: Skillswap[] = [
  {
    _id: "dummy-s1",
    mode: "skill",
    skillName: "Advanced React Patterns",
    description: "I can teach you advanced React (hooks, context, performance). I want to learn basic Python for data science.",
    skillOffered: "React.js",
    skillRequested: "Python",
    status: "open",
    createdBy: { id: { email: "charlie@university.edu" } as any, role: "Student" },
  },
  {
    _id: "dummy-s2",
    mode: "coin",
    skillName: "Figma UI/UX Crash Course",
    description: "I will teach you how to design a modern mobile app in Figma from scratch in 2 hours.",
    coinCost: 150,
    status: "open",
    createdBy: { id: { email: "diana@university.edu" } as any, role: "Student" },
  }
];

export default function SkillswapPage() {
  const router = useRouter();
  const { isAuthenticated, isStudent, profile } = useAuth();
  const [skillswaps, setSkillswaps] = useState<Skillswap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Create form
  const [formMode, setFormMode] = useState<"coin" | "skill">("skill");
  const [formSkillName, setFormSkillName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCoinCost, setFormCoinCost] = useState("");
  const [formSkillOffered, setFormSkillOffered] = useState("");
  const [formSkillRequested, setFormSkillRequested] = useState("");

  // Complete dialog
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);

  const fetchSwaps = useCallback(async () => {
    try {
      const data = await skillswapApi.getAll();
      const realData = data.skillswaps || data as any || [];
      setSkillswaps([...realData, ...dummySwaps]);
    } catch { setSkillswaps(dummySwaps); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSwaps(); }, [fetchSwaps]);

  const filtered = skillswaps.filter((s) => {
    const matchSearch = s.skillName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMode = filterMode === "all" || s.mode === filterMode;
    return matchSearch && matchMode;
  });

  const handleCreate = async () => {
    if (!formSkillName.trim()) { toast.error("Skill name is required"); return; }
    setCreating(true);
    try {
      await skillswapApi.create({
        mode: formMode,
        skillName: formSkillName,
        description: formDesc,
        coinCost: formMode === "coin" ? parseInt(formCoinCost) || 0 : undefined,
        skillOffered: formMode === "skill" ? formSkillOffered : undefined,
        skillRequested: formMode === "skill" ? formSkillRequested : undefined,
      });
      toast.success("Skillswap request created!");
      setCreateOpen(false);
      setFormSkillName(""); setFormDesc(""); setFormCoinCost(""); setFormSkillOffered(""); setFormSkillRequested("");
      fetchSwaps();
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to create");
    } finally { setCreating(false); }
  };

  const handleAccept = async (id: string) => {
    try {
      await skillswapApi.accept(id);
      toast.success("Skillswap accepted!");
      fetchSwaps();
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to accept");
    }
  };

  const handleComplete = async () => {
    if (!completeId) return;
    try {
      await skillswapApi.complete(completeId, { feedback, rating });
      toast.success("Skillswap marked as completed!");
      setCompleteId(null);
      setFeedback(""); setRating(5);
      fetchSwaps();
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to complete");
    }
  };

  const myId = profile?._id;
  const skillswapIntro = `Exchange skills with peers or use NextCoins.\nLearn something new by teaching what you know.\nSkillSwap makes peer learning real.`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 pt-16">
        <div className="mb-12 relative">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">
              <Star className="h-4 w-4 text-[#ef4d23]" /> SKILLSWAP
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Trade skills and learn together.
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Post what you can teach, what you&apos;re chasing next, and connect—no sign-in, no barriers. 
              Every action quietly tops up your NextCoins stash.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-emerald-500 uppercase mt-2">
              <span>+5 NEXTCOINS FOR EACH POST</span>
              <span className="text-border">·</span>
              <span>+1/+4 FOR JOIN ATTEMPTS/APPROVALS</span>
            </div>
          </div>
        </div>

      {/* Search Bar */}
      <div className="relative max-w-4xl mb-12 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Search by skill, tag, or description..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-12 py-7 rounded-2xl border-border bg-card shadow-sm focus-visible:ring-offset-0 focus-visible:ring-1 text-base"
        />
      </div>

      {/* Inline Creation Form */}
      <Card className="rounded-3xl border-border shadow-sm bg-card mb-16 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg font-bold text-foreground">Post a new Skill Swap</CardTitle>
          </div>
          <CardDescription className="text-sm text-neutral-500">
            No log-in, no fuss. Just add the essentials and hit publish.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">TITLE / NAME</Label>
              <Input 
                value={formSkillName} 
                onChange={(e) => setFormSkillName(e.target.value)} 
                placeholder="e.g., Maya" 
                className="bg-card border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">WHAT YOU CAN TEACH</Label>
              <Input 
                value={formSkillOffered} 
                onChange={(e) => setFormSkillOffered(e.target.value)} 
                placeholder="React, calculus, video editing..." 
                className="bg-card border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">WHAT YOU WANT TO LEARN</Label>
              <Input 
                value={formSkillRequested} 
                onChange={(e) => setFormSkillRequested(e.target.value)} 
                placeholder="Figma, DS, public speaking..." 
                className="bg-card border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">SHORT DESCRIPTION</Label>
            <Textarea 
              value={formDesc} 
              onChange={(e) => setFormDesc(e.target.value)} 
              placeholder="Add a simple trade, vibe, or context..." 
              className="bg-card border-border focus-visible:ring-1 focus-visible:ring-ring min-h-[80px] rounded-lg resize-none shadow-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pt-2">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="space-y-1.5 w-1/2 sm:w-auto">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">MODE</Label>
                <div className="flex p-0.5 bg-muted rounded-lg border border-border">
                  <button 
                    onClick={() => setFormMode("skill")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${formMode === "skill" ? "bg-card text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Skill Swap
                  </button>
                  <button 
                    onClick={() => setFormMode("coin")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${formMode === "coin" ? "bg-card text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Coin
                  </button>
                </div>
              </div>
              {formMode === "coin" && (
                <div className="space-y-1.5 w-1/2 sm:w-auto">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">NEXTCOINS</Label>
                  <Input 
                    type="number" 
                    value={formCoinCost} 
                    onChange={(e) => setFormCoinCost(e.target.value)} 
                    placeholder="e.g., 50" 
                    className="w-full sm:w-24 bg-card border-border focus-visible:ring-1 focus-visible:ring-ring rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={handleCreate} 
              disabled={creating} 
              className="w-full sm:w-auto px-8 py-2 h-auto rounded-full bg-primary text-primary-foreground text-sm font-medium transition-colors border-0"
            >
              {creating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : null}
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Header & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h2 className="text-xl font-bold text-foreground">Browse Swaps</h2>
        <div className="flex p-1 bg-muted rounded-xl">
          {["all", "skill", "coin"].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-6 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filterMode === mode ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              {mode === "all" ? "All" : mode === "skill" ? "Skill Swap" : "Coin"}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-2xl bg-card"><CardContent className="py-12 text-center">
          <Repeat2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No skillswap requests found. Create one!</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((swap) => {
            const isOwner = myId && swap.createdBy?.id && (typeof swap.createdBy.id === "object" ? (swap.createdBy.id as any)._id === myId : swap.createdBy.id === myId);
            const canAccept = isAuthenticated && isStudent && !isOwner && swap.status === "open";
            const creator = typeof swap.createdBy?.id === "object" ? swap.createdBy.id : null;
            const creatorEmail = creator && "email" in creator ? (creator as any).email : "Anonymous";
            const isAccepter = (typeof swap.acceptedBy === "string" && swap.acceptedBy === myId) ||
              (typeof swap.acceptedBy === "object" && swap.acceptedBy && (swap.acceptedBy as any)?._id === myId);
            const isParticipant = isOwner || isAccepter;

            return (
              <Card key={swap._id} className="rounded-2xl border border-border shadow-sm bg-card hover:shadow-md transition-all flex flex-col h-full overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={`${statusColors[swap.status]} rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border-0 shadow-sm`}>
                      {swap.status}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(swap.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{swap.skillName}</CardTitle>
                  <CardDescription className="line-clamp-2">{swap.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 flex-grow flex flex-col">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Mode</p>
                      <p className="text-xs font-bold text-foreground capitalize flex items-center gap-1.5">
                        {swap.mode === "coin" ? <Coins className="w-3.5 h-3.5 text-amber-500" /> : <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />}
                        {swap.mode}
                      </p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{swap.mode === "coin" ? "Cost" : "Offered"}</p>
                      <p className="text-xs font-bold text-foreground line-clamp-1">
                        {swap.mode === "coin" ? `${swap.coinCost} Coins` : swap.skillOffered}
                      </p>
                    </div>
                  </div>

                  {swap.mode === "skill" && (
                    <div className="space-y-1">
                      {swap.skillOffered && <div className="text-[11px]"><span className="text-muted-foreground">Offering:</span> <Badge variant="outline" className="text-[9px] ml-1">{swap.skillOffered}</Badge></div>}
                      {swap.skillRequested && <div className="text-[11px]"><span className="text-muted-foreground">Requesting:</span> <Badge variant="outline" className="text-[9px] ml-1">{swap.skillRequested}</Badge></div>}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3 w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <Users className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {creatorEmail.split('@')[0]}
                      </span>
                    </div>

                    <div className="flex gap-2 w-full">
                      {canAccept && (
                        <Button size="sm" onClick={() => handleAccept(swap._id)} className="w-full bg-primary text-primary-foreground rounded-lg text-xs font-bold">
                          Accept Swap
                        </Button>
                      )}
                      {isParticipant && swap.status === "accepted" && (
                        <Button size="sm" onClick={() => setCompleteId(swap._id)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold">
                          Complete
                        </Button>
                      )}
                      {isOwner && swap.status === "open" && <Badge className="w-full justify-center rounded-lg py-1.5" variant="secondary">Your Request</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Complete Dialog */}
      <Dialog open={!!completeId} onOpenChange={(open) => !open && setCompleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Complete Skillswap</DialogTitle>
            <DialogDescription>Leave feedback and rate your experience</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-1">
                {[1,2,3,4,5].map((r) => (
                  <button key={r} onClick={() => setRating(r)} className="p-1">
                    <Star className={`w-6 h-6 ${r <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Feedback</Label>
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="How was the experience?" className="mt-1" />
            </div>
            <Button onClick={handleComplete} className="w-full rounded-xl">
              Submit & Complete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-12 text-center">
        <span className="text-sm text-muted-foreground"><TextGenerateEffect words={skillswapIntro} /></span>
      </div>
    </div></div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Search, Clock, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { addNextCoins } from "@/lib/nextcoins";

type SkillSwapCard = {
  id: string;
  posterName: string;
  teach: string;
  learn: string;
  description: string;
  tags: string[];
  timeSlots: string[];
  createdAt: string;
};

const demoCards: SkillSwapCard[] = [
  {
    id: "1",
    posterName: "Sarah Chen",
    teach: "React",
    learn: "Figma",
    description: "Happy to walk you through React fundamentals. I’d love to learn Figma basics in exchange.",
    tags: ["React", "Figma", "Web Dev"],
    timeSlots: ["Mon 2-4pm", "Fri 10-12am"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    posterName: "Alex Rodriguez",
    teach: "Python",
    learn: "Video Editing",
    description: "Can help with beginner to intermediate Python. Looking for someone to show me how to edit videos for YouTube.",
    tags: ["Python", "Editing"],
    timeSlots: ["Sat 3-5pm"],
    createdAt: new Date().toISOString(),
  },
];

export default function SkillSwapPage() {
  const [cards, setCards] = useState<SkillSwapCard[]>(demoCards);
  const [search, setSearch] = useState("");
  const [joinState, setJoinState] = useState<
    Record<
      string,
      {
        status: "idle" | "loading" | "approved" | "rejected";
        meetLink?: string;
      }
    >
  >({});
  const [form, setForm] = useState({
    name: "",
    teach: "",
    learn: "",
    description: "",
    tags: "",
    timeSlot: "",
  });

  const filteredCards = cards.filter((card) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      card.teach.toLowerCase().includes(q) ||
      card.learn.toLowerCase().includes(q) ||
      card.tags.join(",").toLowerCase().includes(q) ||
      card.description.toLowerCase().includes(q)
    );
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const generateMeetLink = () => {
    const slug = Math.random().toString(36).slice(2, 5);
    const slug2 = Math.random().toString(36).slice(2, 6);
    return `https://meet.google.com/${slug}-${slug2}`;
  };

  const handleCreate = () => {
    if (!form.teach.trim() || !form.learn.trim()) return;
    const newCard: SkillSwapCard = {
      id: (Math.random() * 100000).toFixed(0),
      posterName: form.name.trim() || "Guest",
      teach: form.teach.trim(),
      learn: form.learn.trim(),
      description:
        form.description.trim() ||
        `I can teach ${form.teach.trim()} and want to learn ${form.learn.trim()}.`,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      timeSlots: form.timeSlot ? [form.timeSlot] : [],
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => [newCard, ...prev]);
    addNextCoins(5);
    setForm({
      name: "",
      teach: "",
      learn: "",
      description: "",
      tags: "",
      timeSlot: "",
    });
  };

  const handleJoin = (cardId: string) => {
    if (joinState[cardId]?.status === "loading") return;
    setJoinState((prev) => ({
      ...prev,
      [cardId]: {
        status: "loading",
      },
    }));
    addNextCoins(1);
    setTimeout(() => {
      const approved = Math.random() > 0.4;
      setJoinState((prev) => ({
        ...prev,
        [cardId]: {
          status: approved ? "approved" : "rejected",
          meetLink: approved ? generateMeetLink() : undefined,
        },
      }));
      if (approved) {
        addNextCoins(4);
        toast.success("Request approved! Meet link unlocked.");
      } else {
        toast.error("Request not accepted this time.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground flex items-center justify-center md:justify-start gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            SkillSwap
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Trade skills and learn together.
          </h1>
          <p className="text-base text-muted-foreground">
            Post what you can teach, what you’re chasing next, and connect—no sign-in, no barriers. Every action quietly tops up your NextCoins stash.
          </p>
          <p className="text-xs uppercase tracking-widest text-emerald-500">
            +5 NextCoins for each post · +1/+4 for join attempts/approvals
          </p>
        </header>

        {/* Search bar */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 px-4 py-2 shadow-sm">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by skill, tag, or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Create card */}
        <Card className="rounded-3xl border-border bg-card shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-muted-foreground" />
              Post a new Skill Swap
            </CardTitle>
            <p className="text-sm text-muted-foreground">No log-in, no fuss. Just add the essentials and hit publish.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1 md:col-span-1">
                <label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Your name (optional)
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Maya"
                  value={form.name}
                  onChange={handleChange}
                  className="text-sm bg-secondary/50 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1 md:col-span-1">
                <label htmlFor="teach" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  What you can teach
                </label>
                <Input
                  id="teach"
                  placeholder="React, calculus, video editing..."
                  value={form.teach}
                  onChange={handleChange}
                  className="text-sm bg-secondary/50 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1 md:col-span-1">
                <label htmlFor="learn" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  What you want to learn
                </label>
                <Input
                  id="learn"
                  placeholder="Figma, DS, public speaking..."
                  value={form.learn}
                  onChange={handleChange}
                  className="text-sm bg-secondary/50 focus-visible:ring-ring"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Short description
              </label>
              <Textarea
                id="description"
                placeholder="Add a simple trade, vibe, or context..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="text-sm bg-secondary/50 focus-visible:ring-ring"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="tags" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tags (comma separated)
                </label>
                <Input
                  id="tags"
                  placeholder="React, Figma, Design, CS Club"
                  value={form.tags}
                  onChange={handleChange}
                  className="text-sm bg-secondary/50 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="timeSlot" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Preferred time
                </label>
                <Input
                  id="timeSlot"
                  placeholder="e.g., Weekdays after 6pm"
                  value={form.timeSlot}
                  onChange={handleChange}
                  className="text-sm bg-secondary/50 focus-visible:ring-ring"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleCreate}
                disabled={!form.teach.trim() || !form.learn.trim()}
                variant="default"
                className="rounded-full px-6"
              >
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {filteredCards.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10 text-sm">
              No skill swaps found yet. Try changing your search or create the first post!
            </div>
          ) : (
            filteredCards.map((card) => (
              <Card
                key={card.id}
                className="rounded-2xl border-border bg-card shadow-sm transition hover:border-muted-foreground/50 hover:shadow-md"
              >
                <CardHeader className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </p>
                  <CardTitle className="text-base font-semibold">
                    {card.posterName} wants to learn <span className="text-muted-foreground">{card.learn}</span> & teach{" "}
                    <span className="text-muted-foreground">{card.teach}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{card.description}</p>
                  {card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {card.timeSlots.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{card.timeSlots.join(", ")}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-border space-y-2">
                    <Button
                      className="w-full rounded-full"
                      variant="outline"
                      disabled={joinState[card.id]?.status === "loading"}
                      onClick={() => handleJoin(card.id)}
                    >
                      {joinState[card.id]?.status === "loading"
                        ? "Checking availability..."
                        : joinState[card.id]?.status === "approved"
                        ? "Request again"
                        : "Request to join"}
                    </Button>
                    {joinState[card.id]?.status === "approved" && joinState[card.id]?.meetLink && (
                      <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-3 text-sm space-y-2 text-emerald-700 dark:text-emerald-200">
                        <div className="font-semibold">Approved • Meet link unlocked</div>
                        <a
                          href={joinState[card.id].meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 underline underline-offset-4"
                        >
                          {joinState[card.id].meetLink}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <p className="text-xs opacity-80">
                          Share carefully. A new link is generated when you request again.
                        </p>
                      </div>
                    )}
                    {joinState[card.id]?.status === "rejected" && (
                      <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm flex items-start gap-2 text-amber-700 dark:text-amber-200">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <span>Not accepted this time—try another swap or post your own.</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}



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
import { Users, Plus, Search, UserPlus, Calendar, Wrench } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useAuth } from "@/contexts/auth-context";
import * as collaborationsApi from "@/lib/api/collaborations";
import { toast } from "sonner";
import type { Collaboration, StudentProfile, ApiError } from "@/types";

const dummyCollabs: Collaboration[] = [
  {
    _id: "dummy-c1",
    title: "AI-Powered Study Assistant",
    description: "Looking for React developers and Python ML engineers to build a tool that generates quizzes from lecture notes.",
    requiredSkills: ["React", "Python", "OpenAI"],
    status: "open",
    participants: [],
    createdBy: { id: { email: "alice@university.edu" } as any, role: "Student" },
    deadline: "2026-06-01T00:00:00.000Z",
  },
  {
    _id: "dummy-c2",
    title: "Campus Ride Sharing App",
    description: "Need mobile app developers to build a simple ride sharing app for students on campus to reduce carbon footprint.",
    requiredSkills: ["React Native", "Firebase", "UI/UX"],
    status: "open",
    participants: ["user1", "user2"],
    createdBy: { id: { email: "bob@university.edu" } as any, role: "Student" },
  }
];

export default function CollabPage() {
  const router = useRouter();
  const { isAuthenticated, isStudent, profile } = useAuth();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formSkills, setFormSkills] = useState("");
  const [formDeadline, setFormDeadline] = useState("");

  const fetchCollabs = useCallback(async () => {
    try {
      const data = await collaborationsApi.getAll();
      const realData = data.collaborations || data as any || [];
      setCollaborations([...realData, ...dummyCollabs]);
    } catch { setCollaborations(dummyCollabs); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCollabs(); }, [fetchCollabs]);

  const filtered = collaborations.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    if (!formTitle.trim()) { toast.error("Title is required"); return; }
    setCreating(true);
    try {
      await collaborationsApi.create({
        title: formTitle,
        description: formDesc,
        requiredSkills: formSkills ? formSkills.split(",").map(s => s.trim()) : [],
        deadline: formDeadline || undefined,
      });
      toast.success("Collaboration created!");
      setCreateOpen(false);
      setFormTitle(""); setFormDesc(""); setFormSkills(""); setFormDeadline("");
      fetchCollabs();
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to create");
    } finally { setCreating(false); }
  };

  const handleJoin = async (id: string) => {
    try {
      await collaborationsApi.join(id);
      toast.success("Joined collaboration!");
      fetchCollabs();
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to join");
    }
  };

  const collabIntro = `Collaborate with peers on exciting projects.\nFind team members, share skills, and build together.\nCollab makes teamwork happen.`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 pt-16">
        <div className="mb-12 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">
                <Users className="h-4 w-4 text-emerald-500" /> COLLAB
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                Find team members and build together.
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
                Collaborate with peers on exciting projects. Find team members, share skills, and build together.
              </p>
            </div>
        {(!isAuthenticated || isStudent) && (
          isAuthenticated ? (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full bg-card text-muted-foreground border-border hover:bg-accent h-10 px-4">
                  <Plus className="w-4 h-4 mr-2" /> New Collab
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Collaboration</DialogTitle>
                <DialogDescription>Start a new project and find teammates</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Title</Label>
                  <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., AI Study Group" className="mt-1" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="What's this collaboration about?" className="mt-1" />
                </div>
                <div>
                  <Label>Required Skills (comma-separated)</Label>
                  <Input value={formSkills} onChange={(e) => setFormSkills(e.target.value)} placeholder="e.g., React, Python, ML" className="mt-1" />
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input type="date" value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)} className="mt-1" />
                </div>
                <Button onClick={handleCreate} disabled={creating} className="w-full bg-[#ef4d23] hover:bg-[#d9431d] text-white rounded-xl">
                  {creating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : null}
                  Create Collaboration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          ) : (
            <Button variant="outline" onClick={() => router.push("/auth")} className="rounded-full bg-card text-muted-foreground border-border hover:bg-accent h-10 px-4">
              <Plus className="w-4 h-4 mr-2" /> New Collab
            </Button>
          )
        )}
          </div>

      {/* Search */}
      <div className="max-w-xl mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input placeholder="Search collaborations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 py-6 rounded-[14px] bg-muted border-border focus:bg-background shadow-sm text-base focus-visible:ring-1 focus-visible:ring-ring transition-colors" />
        </div>
      </div>
        </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-3xl bg-card border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 font-medium">No collaborations found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((collab) => {
            const creator = typeof collab.createdBy?.id === "object" ? collab.createdBy.id : null;
            const creatorEmail = creator && "email" in creator ? (creator as any).email : "Anonymous";
            const participantCount = collab.participants?.length || 0;
            const myId = profile?._id;
            const alreadyJoined = collab.participants?.some((p) => {
              const pid = typeof p === "string" ? p : (p as any)?._id;
              return pid === myId;
            });
            const isOwner = typeof collab.createdBy?.id === "object" && (collab.createdBy.id as any)?._id === myId;

            return (
              <Card key={collab._id} className="rounded-2xl border border-border shadow-sm bg-card hover:shadow-md transition-all flex flex-col h-full overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="secondary" className="capitalize">{collab.status || "open"}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" /> {participantCount}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{collab.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{collab.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {collab.requiredSkills && collab.requiredSkills.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Wrench className="w-3 h-3 text-muted-foreground shrink-0" />
                      {collab.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-[10px]">{skill}</Badge>
                      ))}
                    </div>
                  )}
                  {collab.deadline && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" /> {new Date(collab.deadline).toLocaleDateString()}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">by {creatorEmail}</div>
                  {(!isAuthenticated || isStudent) && !isOwner && !alreadyJoined && (
                    <Button size="sm" onClick={() => isAuthenticated ? handleJoin(collab._id) : router.push("/auth")} className="w-full bg-primary text-primary-foreground rounded-lg">
                      <UserPlus className="w-3 h-3 mr-1" /> Join
                    </Button>
                  )}
                  {alreadyJoined && <Badge className="w-full justify-center bg-green-500/10 text-green-600 border-green-200">Joined</Badge>}
                  {isOwner && <Badge className="w-full justify-center" variant="secondary">Your Collab</Badge>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-12 text-center">
        <span className="text-sm text-muted-foreground">
          <TextGenerateEffect words={collabIntro} />
        </span>
      </div>
    </div>
    </div>
  );
}
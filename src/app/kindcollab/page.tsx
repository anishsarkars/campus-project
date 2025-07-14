"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, MessageSquare, Clock, MapPin, Star, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import confetti from "canvas-confetti";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

// Mock data for demonstration
const COLLAB_TYPES = [
  { value: "skill_swap", label: "Skill Swap" },
  { value: "team_up", label: "Team Up" },
  { value: "idea_partner", label: "Idea/Partner" },
];

// 2. Update mockCards to use new types and structure
const mockCards = [
  {
    id: "1",
    posterId: "user1",
    posterName: "Sarah Chen",
    type: "skill_swap" as const,
    title: "I can teach React, want to learn Figma",
    description: "I can help you get started with React. Looking to learn Figma basics.",
    tags: ["React", "Figma", "Web Dev"],
    timeSlots: ["Monday 2-4pm", "Friday 10-12am"],
    contactNumber: "123-456-7890",
    timestamp: new Date(),
    status: "active" as const
  },
  {
    id: "2",
    posterId: "user2",
    posterName: "Alex Rodriguez",
    type: "team_up" as const,
    title: "Need teammates for hackathon",
    description: "Looking for 2 teammates for the upcoming campus hackathon. Need frontend and backend developers.",
    tags: ["Hackathon", "Programming", "Team"],
    timeSlots: ["Friday 6-8pm", "Saturday 9am-5pm"],
    contactNumber: "234-567-8901",
    timestamp: new Date(),
    status: "active" as const
  },
  {
    id: "3",
    posterId: "user3",
    posterName: "Emma Wilson",
    type: "idea_partner" as const,
    title: "Looking for a study partner",
    description: "Need a partner for regular calculus study sessions.",
    tags: ["Math", "Calculus", "Study"],
    timeSlots: ["Tuesday 3-5pm", "Thursday 1-3pm"],
    contactNumber: "345-678-9012",
    timestamp: new Date(),
    status: "active" as const
  }
];

export default function KindCollabPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [mockCardsState, setMockCardsState] = useState<any[]>(mockCards);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update form state to support dynamic fields
  const [form, setForm] = useState({
    type: COLLAB_TYPES[0].value,
    title: "",
    description: "",
    tags: "",
    timeSlots: [""],
    contactNumber: "",
    teach: "",
    learn: "",
    teamDetails: "",
    ideaDetails: ""
  });

  // Update handleFormChange to support dynamic fields
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, idx?: number) => {
    const { id, value } = e.target;
    if (id === "timeSlot" && typeof idx === "number") {
      setForm((prev) => {
        const newSlots = [...prev.timeSlots];
        newSlots[idx] = value;
        return { ...prev, timeSlots: newSlots };
      });
    } else {
      setForm((prev) => ({ ...prev, [id]: value }));
    }
  };

  const addTimeSlot = () => {
    setForm((prev) => ({ ...prev, timeSlots: [...prev.timeSlots, ""] }));
  };

  const removeTimeSlot = (idx: number) => {
    setForm((prev) => ({ ...prev, timeSlots: prev.timeSlots.filter((_, i) => i !== idx) }));
  };

  // Add create post handler
  const handleCreatePost = () => {
    let newCard = {
      id: (Math.random() * 100000).toFixed(0),
      posterId: user?.id || "anon",
      posterName: user?.fullName || user?.username || "Anonymous",
      type: form.type,
      title: form.title,
      description: form.description,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      timeSlots: form.timeSlots.filter(Boolean),
      contactNumber: form.contactNumber,
      timestamp: new Date(),
      status: "active"
    };
    // Add extra fields for Skill Swap, Team Up, Idea/Partner
    if (form.type === "skill_swap") {
      newCard = {
        ...newCard,
        title: form.teach && form.learn ? `I can teach ${form.teach}, want to learn ${form.learn}` : form.title,
        description: form.description || `Teach: ${form.teach}, Learn: ${form.learn}`
      };
    } else if (form.type === "team_up") {
      newCard = {
        ...newCard,
        description: form.teamDetails || form.description
      };
    } else if (form.type === "idea_partner") {
      newCard = {
        ...newCard,
        description: form.ideaDetails || form.description
      };
    }
    setMockCardsState(prev => [newCard, ...prev]);
    setIsCreateDialogOpen(false);
    setForm({
      type: COLLAB_TYPES[0].value,
      title: "",
      description: "",
      tags: "",
      timeSlots: [""],
      contactNumber: "",
      teach: "",
      learn: "",
      teamDetails: "",
      ideaDetails: ""
    });
  };

  // Search and filter state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Filter and search logic
  const filteredCards = mockCardsState.filter(card => {
    const matchesType = !filterType || card.type === filterType;
    const matchesSearch =
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.tags.join(",").toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });
  const paginatedCards = filteredCards.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredCards.length / pageSize);

  // 3. Update getTypeIcon and getTypeLabel
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "skill_swap":
        return <Star className="h-4 w-4 text-green-500" />;
      case "team_up":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "idea_partner":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "skill_swap":
        return "Skill Swap";
      case "team_up":
        return "Team Up";
      case "idea_partner":
        return "Idea/Partner";
      default:
        return type;
    }
  };

  // Join/match prototype state
  const [joinRequests, setJoinRequests] = useState<any[]>([]); // {cardId, joinerId, joinerName, status: 'pending'|'approved'}
  const [showJoinStatus, setShowJoinStatus] = useState<{cardId: string, status: 'pending'|'approved'|null}|null>(null);
  const [showMatchDetails, setShowMatchDetails] = useState<{cardId: string, joinerName: string, type: string}|null>(null);
  const [joinLoading, setJoinLoading] = useState<string | null>(null); // cardId if loading
  const [joinRejected, setJoinRejected] = useState<{cardId: string, reason: string}|null>(null);

  // Handler: Join button
  const handleJoin = (card: any) => {
    if (!user) return;
    setJoinLoading(card.id);
    setTimeout(() => {
      setJoinLoading(null);
      setShowJoinStatus({cardId: card.id, status: 'pending'});
      // Simulate approval/rejection after another delay
      setTimeout(() => {
        // Randomly approve or reject
        const approved = Math.random() > 0.4; // 60% approve, 40% reject
        if (approved) {
          setJoinRequests(prev => [
            ...prev,
            {
              cardId: card.id,
              joinerId: user.id,
              joinerName: user.fullName || user.username || 'Anonymous',
              status: 'approved',
              type: card.type,
              posterId: card.posterId,
              posterName: card.posterName,
              contactNumber: user.phoneNumbers?.[0]?.phoneNumber || 'N/A',
            }
          ]);
          setShowJoinStatus({cardId: card.id, status: 'approved'});
          // Subtle confetti effect
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 },
            scalar: 0.7,
          });
        } else {
          setJoinRejected({cardId: card.id, reason: 'Your request was rejected by the poster.'});
          setShowJoinStatus(null);
        }
      }, 2000);
    }, 1500);
  };

  // Handler: Approve request
  const handleApprove = (req: any) => {
    setJoinRequests(prev => prev.map(r => r === req ? {...r, status: 'approved'} : r));
    setShowMatchDetails({cardId: req.cardId, joinerName: req.joinerName, type: req.type});
  };

  // Handler: Close match details
  const closeMatchDetails = () => setShowMatchDetails(null);

  // Handler: Close join status
  const closeJoinStatus = () => setShowJoinStatus(null);

  // Handler to close rejection
  const closeJoinRejected = () => setJoinRejected(null);

  // Poster dashboard: show requests for cards where user is poster
  const posterRequests = isSignedIn && user ? joinRequests.filter(r => r.posterId === user.id && r.status === 'pending') : [];

  // Joiner: show approved matches for this user
  const approvedMatches = isSignedIn && user ? joinRequests.filter(r => r.joinerId === user.id && r.status === 'approved') : [];

  const kindCollabIntro = `Skill Swap, Team Up, or Find a Partner.\nCreate a card, get requests, connect instantly.\nKindCollab makes campus collaboration easy.`;

  return (
    <div className="min-h-screen bg-background py-10 px-2 md:px-8 transition-colors flex flex-col min-h-screen">
      {/* Search & Filter Bar */}
      <div className={`max-w-6xl mx-auto mb-8 sticky z-30 transition-all duration-300 ${scrolled ? 'top-16' : 'top-6'}`} style={{paddingTop: scrolled ? '0.5rem' : '0'}}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/70 dark:bg-background/70 rounded-2xl shadow-lg p-4 border border-border backdrop-blur-md">
          <div className="flex items-center flex-1 gap-2 bg-background rounded-xl px-3 py-2 border border-input">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-foreground"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {COLLAB_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setFilterType(filterType === t.value ? null : t.value)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full border text-sm font-medium transition-all
                  ${filterType === t.value ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input text-foreground hover:bg-muted"}`}
              >
                <Filter className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collab Cards Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedCards.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 col-span-full">No results found.</div>
        ) : (
          paginatedCards.map(card => (
            <div
              key={card.id}
              className="relative flex flex-col bg-card rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow min-h-[260px]"
            >
              {/* Top: Icon or logo */}
              <div className="flex items-center gap-2 px-5 pt-5">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
                  {getTypeIcon(card.type)}
                </div>
                <span className="font-semibold text-foreground">{getTypeLabel(card.type)}</span>
                <span className="ml-auto text-xs text-muted-foreground">{card.timestamp.toLocaleDateString()}</span>
              </div>
              {/* Title */}
              <div className="px-5 pt-2 font-bold text-lg text-foreground line-clamp-1">{card.title}</div>
              {/* Description */}
              <div className="px-5 pt-1 text-muted-foreground text-sm line-clamp-2">{card.description}</div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 px-5 pt-2">
                {card.tags.map((tag: string) => (
                  <span key={tag} className="bg-muted text-foreground px-3 py-1 rounded-full text-xs font-medium border border-border">{tag}</span>
                ))}
              </div>
              {/* Time slots */}
              <div className="flex items-center gap-2 px-5 pt-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{card.timeSlots.join(", ")}</span>
              </div>
              {/* Action button */}
              <div className="flex items-center justify-end px-5 pb-5 mt-auto">
        {isLoaded && !isSignedIn ? (
          <SignInButton mode="modal">
                    <Button className="w-full" size="sm">Sign in to Join</Button>
          </SignInButton>
        ) : (
                  joinLoading === card.id ? (
                    <Button className="w-full" size="sm" disabled>
                      <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      Loading...
                    </Button>
                  ) : joinRequests.some(r => r.cardId === card.id && r.joinerId === user?.id) ? (
                    <Button className="w-full" size="sm" disabled>
                      Awaiting approval...
                    </Button>
                  ) : (
                    <Button className="w-full" size="sm" onClick={() => handleJoin(card)}>
                      Join
                    </Button>
                  )
                )}
              </div>
              {/* Details badge (optional) */}
              <span className="absolute top-5 right-5 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">New</span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-6xl mx-auto flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-full border border-border bg-card text-muted-foreground disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${page === num ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border hover:bg-muted"}`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-full border border-border bg-card text-muted-foreground disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Create Post Dialog (unchanged, but visually fits new design) */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <div className="fixed left-1/2 bottom-8 z-50 -translate-x-1/2 flex justify-center w-full pointer-events-none">
            <Button className="pointer-events-auto rounded-full shadow-lg bg-primary text-primary-foreground w-16 h-16 flex items-center justify-center text-3xl" size="icon">
              <Plus className="h-8 w-8" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
            <DialogTitle>Create New Collab Card</DialogTitle>
                <DialogDescription>
              Choose a type, fill in details, and connect with others!
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={form.type}
                onChange={handleFormChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {COLLAB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
                  </select>
                </div>
            {form.type === 'skill_swap' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><Label htmlFor="teach">What you can teach</Label><Input id="teach" value={form.teach} onChange={handleFormChange} placeholder="e.g., React" /></div>
                <div><Label htmlFor="learn">What you want to learn</Label><Input id="learn" value={form.learn} onChange={handleFormChange} placeholder="e.g., Figma" /></div>
              </div>
            )}
            {form.type === 'team_up' && (
              <div className="grid gap-2"><Label htmlFor="teamDetails">Team/project details</Label><Textarea id="teamDetails" value={form.teamDetails} onChange={handleFormChange} placeholder="Describe your team or project needs..." /></div>
            )}
            {form.type === 'idea_partner' && (
              <div className="grid gap-2"><Label htmlFor="ideaDetails">Idea/partner details</Label><Textarea id="ideaDetails" value={form.ideaDetails} onChange={handleFormChange} placeholder="Describe your idea or what kind of partner you want..." /></div>
            )}
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={handleFormChange} placeholder="e.g., I can teach React, want to learn Figma" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea id="description" value={form.description} onChange={handleFormChange} placeholder="Describe your offer or request..." />
                </div>
                <div className="grid gap-2">
              <Label htmlFor="tags">Tags (skills, department, event, tech, comma separated)</Label>
              <Input id="tags" value={form.tags} onChange={handleFormChange} placeholder="React, Figma, Hackathon" />
                </div>
                <div className="grid gap-2">
              <Label>Available Time Slots</Label>
              {form.timeSlots.map((slot, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <Input
                    id="timeSlot"
                    value={slot}
                    onChange={(e) => handleFormChange(e, idx)}
                    placeholder="e.g., Monday 2-4pm"
                  />
                  {form.timeSlots.length > 1 && (
                    <Button type="button" size="icon" variant="outline" onClick={() => removeTimeSlot(idx)}>-</Button>
                  )}
                </div>
              ))}
              <Button type="button" size="sm" variant="outline" onClick={addTimeSlot}>+ Add Time Slot</Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactNumber">Contact Number <span className="text-xs text-muted-foreground">(private until match approved)</span></Label>
              <Input id="contactNumber" value={form.contactNumber} onChange={handleFormChange} placeholder="Your phone number" />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
            <Button onClick={handleCreatePost}>
                  Create Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>

      {/* Poster dashboard for join requests */}
      {isSignedIn && posterRequests.length > 0 && (
        <div className="max-w-6xl mx-auto mb-8 p-4 bg-card border border-border rounded-xl shadow">
          <h2 className="font-bold text-lg mb-2">Join Requests</h2>
          <ul className="space-y-2">
            {posterRequests.map((req, idx) => (
              <li key={idx} className="flex items-center justify-between bg-muted rounded p-2">
                <span>👤 <b>{req.joinerName}</b> wants to join your {getTypeLabel(req.type)}</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(req)}>Approve</Button>
                    </div>
              </li>
            ))}
          </ul>
                    </div>
      )}

      {/* Joiner: show approved match details */}
      {isSignedIn && approvedMatches.length > 0 && approvedMatches.map((match, idx) => (
        <div key={idx} className="max-w-6xl mx-auto mb-4 p-4 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-xl shadow flex flex-col gap-2">
          <span className="font-semibold text-green-700 dark:text-green-200">Your request was approved! You can now connect on {match.type === 'skill_swap' ? 'Meet/phone' : 'phone'}.</span>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {match.type === 'skill_swap' && (
              <a href="https://meet.google.com/woh-jwhi-kqv" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-300">Join Google Meet</a>
            )}
            <span className="text-sm">Poster contact: <b>{mockCards.find(c => c.id === match.cardId)?.contactNumber || 'N/A'}</b></span>
            <span className="text-sm">Your contact: <b>{match.contactNumber}</b></span>
                      </div>
                        </div>
                      ))}

      {/* Join status modal for joiner */}
      <HeadlessDialog open={!!showJoinStatus} onClose={closeJoinStatus} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative bg-card rounded-xl p-6 shadow-xl border border-border max-w-sm mx-auto">
          {showJoinStatus?.status === 'pending' && <div className="text-lg font-semibold mb-2">Awaiting approval from poster...</div>}
          {showJoinStatus?.status === 'approved' && <div className="text-lg font-semibold mb-2">Your request was approved!</div>}
          <Button className="mt-4 w-full" onClick={closeJoinStatus}>Close</Button>
                    </div>
      </HeadlessDialog>

      {/* Match details modal for poster */}
      <HeadlessDialog open={!!showMatchDetails} onClose={closeMatchDetails} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative bg-card rounded-xl p-6 shadow-xl border border-border max-w-sm mx-auto">
          <div className="text-lg font-semibold mb-2">Match Approved!</div>
          {showMatchDetails && (
            <>
              {showMatchDetails.type === 'skill_swap' && (
                <a href="https://meet.google.com/woh-jwhi-kqv" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 dark:text-blue-300 block mb-2">Google Meet Link</a>
              )}
              <div className="text-sm mb-1">Joiner: <b>{showMatchDetails.joinerName}</b></div>
              <div className="text-sm mb-1">Poster contact: <b>{mockCards.find(c => c.id === showMatchDetails.cardId)?.contactNumber || 'N/A'}</b></div>
              {/* In a real app, show joiner contact too */}
            </>
          )}
          <Button className="mt-4 w-full" onClick={closeMatchDetails}>Close</Button>
                  </div>
      </HeadlessDialog>

      {/* Rejection modal for joiner */}
      <HeadlessDialog open={!!joinRejected} onClose={closeJoinRejected} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative bg-card rounded-xl p-6 shadow-xl border border-border max-w-sm mx-auto">
          <div className="text-lg font-semibold mb-2 text-red-600">Request Rejected</div>
          <div className="mb-4">{joinRejected?.reason}</div>
          <Button className="mt-4 w-full" onClick={closeJoinRejected}>Close</Button>
          </div>
      </HeadlessDialog>
      {/* Place intro at the bottom, extra tiny, wider, and lighter */}
      <div className="mt-auto max-w-2xl mx-auto text-center pb-1">
        <span className="text-[8px] text-muted-foreground/50 font-mono">
          <TextGenerateEffect words={kindCollabIntro} />
        </span>
      </div>
    </div>
  );
} 
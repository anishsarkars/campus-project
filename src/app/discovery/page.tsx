"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Compass, ExternalLink, Calendar, MapPin, Plus, Send, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import * as opportunitiesApi from "@/lib/api/opportunities";
import { toast } from "sonner";
import type { Opportunity, ApiError } from "@/types";

const typeColors: Record<string, string> = {
  hackathon: "bg-purple-100 text-purple-700",
  scholarship: "bg-emerald-100 text-emerald-700",
  event: "bg-blue-100 text-blue-700",
  opportunity: "bg-amber-100 text-amber-700",
};

const typeIcons: Record<string, React.ReactNode> = {
  hackathon: <Briefcase className="h-3.5 w-3.5" />,
  scholarship: <Briefcase className="h-3.5 w-3.5" />,
  event: <Calendar className="h-3.5 w-3.5" />,
  opportunity: <Compass className="h-3.5 w-3.5" />,
};

const dummyOpportunities: any[] = [
  {
    _id: "dummy-1",
    title: "Global AI Hackathon 2026",
    type: "hackathon",
    displayDate: "Oct 15-17, 2026",
    location: "Online",
    description: "Build the future of AI in 48 hours. Compete for $50k in prizes and connect with top engineers.",
    apply_link: "#",
    tags: ["AI", "Next.js", "Prizes"],
    postedBy: { id: { name: "NextUp Team" } as any, role: "Organisation" },
  },
  {
    _id: "dummy-2",
    title: "Women in Tech Scholarship",
    type: "scholarship",
    displayDate: "Deadline: Nov 1, 2026",
    location: "Global",
    description: "$10,000 scholarship awarded to outstanding female undergraduate students pursuing computer science.",
    apply_link: "#",
    tags: ["Diversity", "Undergraduate"],
    postedBy: { id: { name: "Tech Foundation" } as any, role: "Organisation" },
  },
  {
    _id: "dummy-3",
    title: "Campus Tech Summit",
    type: "event",
    displayDate: "Dec 5, 2026",
    location: "Main Auditorium",
    description: "Annual university tech conference featuring keynote speakers from Google, Microsoft, and Vercel.",
    apply_link: "#",
    tags: ["Networking", "Conference"],
    postedBy: { id: { name: "TechCorp" } as any, role: "Organisation" },
  },
  {
    _id: "dummy-4",
    title: "Open Source Fellowship",
    type: "opportunity",
    displayDate: "Starts Jan 2027",
    location: "Remote",
    description: "A 3-month paid fellowship program where you contribute to major open source projects with mentorship.",
    apply_link: "#",
    tags: ["Open Source", "Paid"],
    postedBy: { id: { name: "TechCorp" } as any, role: "Organisation" },
  }
];

export default function DiscoveryPage() {
  const router = useRouter();
  const { isAuthenticated, isStudent } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Create form state
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<"hackathon" | "scholarship" | "event" | "opportunity">("hackathon");
  const [formDesc, setFormDesc] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDeadline, setFormDeadline] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formLink, setFormLink] = useState("");

  const fetchOpportunities = useCallback(async () => {
    try {
      const data = await opportunitiesApi.getAll();
      const realData = data.opportunities || data as any || [];
      setOpportunities([...realData, ...dummyOpportunities]);
    } catch {
      setOpportunities(dummyOpportunities);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const filtered = opportunities.filter((opp) => {
    const matchSearch = opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || opp.type === filterType;
    return matchSearch && matchType;
  });

  const handleCreate = async () => {
    if (!formTitle.trim()) { toast.error("Title is required"); return; }
    setCreating(true);
    try {
      await opportunitiesApi.create({
        title: formTitle,
        type: formType,
        description: formDesc,
        location: formLocation,
        deadline: formDeadline || undefined,
        tags: formTags ? formTags.split(",").map(t => t.trim()) : [],
        apply_link: formLink || undefined,
      });
      toast.success("Opportunity posted!");
      setCreateOpen(false);
      setFormTitle(""); setFormDesc(""); setFormLocation(""); setFormDeadline(""); setFormTags(""); setFormLink("");
      fetchOpportunities();
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  const handleApply = async (id: string) => {
    try {
      await opportunitiesApi.apply(id);
      toast.success("Applied successfully!");
    } catch (err) {
      toast.error((err as ApiError).message || "Failed to apply");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 pt-16">
        {/* Header Section */}
        <div className="mb-12 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">
                <Compass className="h-4 w-4 text-[#3b82f6]" /> DISCOVERY
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                Find your next big opportunity.
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
                Explore scholarships, upcoming hackathons, campus events, and open-source fellowships carefully curated for students.
              </p>
            </div>
            {/* Minimal Post Button visible for orgs/admin or just keep it minimal */}
            {isAuthenticated && (
              <div className="hidden sm:block">
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-full bg-card text-muted-foreground border-border hover:bg-accent h-10 px-4">
                      <Plus className="w-4 h-4 mr-2" /> Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Post an Opportunity</DialogTitle>
                    </DialogHeader>
                    {/* form fields omitted for brevity, same as before */}
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Title</Label>
                        <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., Summer Internship 2026" className="mt-1" />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <select value={formType} onChange={(e) => setFormType(e.target.value as any)}
                          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="hackathon">Hackathon</option>
                          <option value="scholarship">Scholarship</option>
                          <option value="event">Event</option>
                          <option value="opportunity">Opportunity</option>
                        </select>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Details about the opportunity..." className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Location</Label>
                          <Input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="e.g., Remote" className="mt-1" />
                        </div>
                        <div>
                          <Label>Deadline</Label>
                          <Input type="date" value={formDeadline} onChange={(e) => setFormDeadline(e.target.value)} className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label>Tags (comma-separated)</Label>
                        <Input value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="e.g., AI, React, Remote" className="mt-1" />
                      </div>
                      <div>
                        <Label>Apply Link</Label>
                        <Input value={formLink} onChange={(e) => setFormLink(e.target.value)} placeholder="https://..." className="mt-1" />
                      </div>
                      <Button onClick={handleCreate} disabled={creating} className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl">
                        {creating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : null}
                        Post Opportunity
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          {/* Search and Filters */}
          <div className="max-w-xl">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input 
                placeholder="Search opportunities..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-12 py-6 rounded-[14px] bg-muted border-border focus:bg-background shadow-sm text-base focus-visible:ring-1 focus-visible:ring-ring transition-colors" 
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "hackathon", "scholarship", "event", "opportunity"].map((type) => (
                <button 
                  key={type} 
                  onClick={() => setFilterType(type)} 
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${filterType === type ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-card hover:text-foreground shadow-sm"}`}
                >
                  {type === "all" ? "All" : type}
                </button>
              ))}
            </div>
          </div>
        </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-3xl bg-card border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <Compass className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No opportunities found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((opp) => {
            const displayDate = opp.displayDate || (opp.deadline ? new Date(opp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "");
            
            return (
              <Card key={opp._id} className="rounded-2xl border border-border shadow-sm bg-card hover:shadow-md transition-all flex flex-col h-full overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="secondary" className={`capitalize ${typeColors[opp.type] || "bg-muted text-muted-foreground"}`}>
                      {opp.type}
                    </Badge>
                    {displayDate && (
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {displayDate}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{opp.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{opp.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow flex flex-col">
                  {opp.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" /> {opp.location}
                    </div>
                  )}
                  {opp.tags && opp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {opp.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-4 flex justify-center w-full">
                    <Button 
                      onClick={() => isAuthenticated ? handleApply(opp._id) : router.push("/auth")} 
                      className="w-full text-xs font-bold"
                    >
                      View Details <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

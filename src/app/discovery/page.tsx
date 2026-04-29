"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Compass, ExternalLink, Calendar, Trophy, GraduationCap, MapPin } from "lucide-react";

type DiscoveryItem = {
  id: string;
  title: string;
  type: "Hackathon" | "Scholarship" | "Event" | "Opportunity";
  date: string;
  location: string;
  description: string;
  link: string;
  tags: string[];
};

const demoItems: DiscoveryItem[] = [
  {
    id: "1",
    title: "Global AI Hackathon 2026",
    type: "Hackathon",
    date: "Oct 15-17, 2026",
    location: "Online",
    description: "Build the future of AI in 48 hours. Compete for $50k in prizes and connect with top engineers.",
    link: "#",
    tags: ["AI", "Next.js", "Prizes"],
  },
  {
    id: "2",
    title: "Women in Tech Scholarship",
    type: "Scholarship",
    date: "Deadline: Nov 1, 2026",
    location: "Global",
    description: "$10,000 scholarship awarded to outstanding female undergraduate students pursuing computer science.",
    link: "#",
    tags: ["Diversity", "Undergraduate"],
  },
  {
    id: "3",
    title: "Campus Tech Summit",
    type: "Event",
    date: "Dec 5, 2026",
    location: "Main Auditorium",
    description: "Annual university tech conference featuring keynote speakers from Google, Microsoft, and Vercel.",
    link: "#",
    tags: ["Networking", "Conference"],
  },
  {
    id: "4",
    title: "Open Source Fellowship",
    type: "Opportunity",
    date: "Starts Jan 2027",
    location: "Remote",
    description: "A 3-month paid fellowship program where you contribute to major open source projects with mentorship.",
    link: "#",
    tags: ["Open Source", "Paid"],
  },
];

const typeIcons = {
  Hackathon: <Trophy className="w-4 h-4" />,
  Scholarship: <GraduationCap className="w-4 h-4" />,
  Event: <Calendar className="w-4 h-4" />,
  Opportunity: <Compass className="w-4 h-4" />,
};

const typeColors = {
  Hackathon: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  Scholarship: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  Event: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Opportunity: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
};

export default function DiscoveryPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", "Hackathon", "Scholarship", "Event", "Opportunity"];

  const filteredItems = demoItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground flex items-center justify-center md:justify-start gap-2">
            <Compass className="w-4 h-4 text-blue-500" />
            Discovery
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Find your next big opportunity.
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Explore scholarships, upcoming hackathons, campus events, and open-source fellowships carefully curated for students.
          </p>
        </header>

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/50 px-4 py-2 shadow-sm max-w-md">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setActiveFilter(filter)}
                size="sm"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12 text-sm">
              No opportunities found matching your criteria.
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="rounded-2xl border-border bg-card shadow-sm transition hover:border-muted-foreground/50 hover:shadow-md flex flex-col h-full">
                <CardHeader className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <Badge variant="outline" className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 border ${typeColors[item.type]}`}>
                      {typeIcons[item.type]}
                      {item.type}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-semibold leading-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground flex-1">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-5 mt-auto border-t border-border">
                    <Button variant="ghost" className="w-full rounded-full flex items-center justify-center gap-2 hover:bg-secondary">
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </Button>
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

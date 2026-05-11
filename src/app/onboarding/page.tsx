"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import * as usersApi from "@/lib/api/users";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, SkipForward, Check, MapPin, GraduationCap, Wrench, Globe } from "lucide-react";

const SKILL_SUGGESTIONS = [
  "JavaScript", "Python", "React", "Node.js", "TypeScript", "Java", "C++",
  "Machine Learning", "Data Science", "UI/UX Design", "Figma", "Docker",
  "AWS", "MongoDB", "PostgreSQL", "Flutter", "Swift", "Kotlin", "Go", "Rust",
];

const DOMAIN_SUGGESTIONS = [
  "Web Development", "Mobile Development", "AI/ML", "Data Science",
  "Cloud Computing", "Cybersecurity", "DevOps", "Blockchain",
  "Game Development", "IoT", "AR/VR", "Embedded Systems",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Student fields
  const [collegeName, setCollegeName] = useState("");
  const [course, setCourse] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  // Organisation fields
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgLocation, setOrgLocation] = useState("");

  if (!isAuthenticated) {
    router.push("/auth");
    return null;
  }

  const isStudent = user?.role === "student";
  const totalSteps = isStudent ? 4 : 3;

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleDomain = (domain: string) => {
    setDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      if (isStudent) {
        await usersApi.updateProfile({
          education: { collegeName, course, year_of_graduation: gradYear ? parseInt(gradYear) : undefined },
          location,
          skills,
          intrested_domains: domains,
          profiles: { linkedin, github },
        });
      } else {
        await usersApi.updateProfile({
          name: orgName,
          description: orgDescription,
          location: orgLocation,
          profile: { website: orgWebsite, linkedin },
        });
      }
      await refreshProfile();
      toast.success("Profile set up successfully!");
      router.push("/");
    } catch {
      toast.error("Failed to save profile. You can update it later.");
      router.push("/");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const renderStep = () => {
    if (isStudent) {
      switch (step) {
        case 0:
          return (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">Education</h2>
                <p className="text-sm text-muted-foreground">Tell us about your college</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="college" className="text-sm">College Name</Label>
                  <div className="relative mt-1">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="college" className="pl-10" placeholder="e.g., IIT Delhi" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="course" className="text-sm">Course / Degree</Label>
                  <Input id="course" placeholder="e.g., B.Tech Computer Science" value={course} onChange={(e) => setCourse(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="gradyear" className="text-sm">Year of Graduation</Label>
                  <Input id="gradyear" type="number" placeholder="e.g., 2026" value={gradYear} onChange={(e) => setGradYear(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm">Location</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="location" className="pl-10" placeholder="e.g., New Delhi" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Wrench className="w-5 h-5" /> Skills</h2>
                <p className="text-sm text-muted-foreground">Select your skills or add custom ones</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.map((skill) => (
                  <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      skills.includes(skill) ? "bg-[#ef4d23] text-white border-[#ef4d23]" : "bg-card text-muted-foreground border-border hover:border-[#ef4d23]/50"
                    }`}
                  >
                    {skills.includes(skill) && <Check className="w-3 h-3 inline mr-1" />}
                    {skill}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{skills.length} selected</p>
            </div>
          );
        case 2:
          return (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">Interests</h2>
                <p className="text-sm text-muted-foreground">What domains excite you?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {DOMAIN_SUGGESTIONS.map((domain) => (
                  <button key={domain} type="button" onClick={() => toggleDomain(domain)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      domains.includes(domain) ? "bg-[#ef4d23] text-white border-[#ef4d23]" : "bg-card text-muted-foreground border-border hover:border-[#ef4d23]/50"
                    }`}
                  >
                    {domains.includes(domain) && <Check className="w-3 h-3 inline mr-1" />}
                    {domain}
                  </button>
                ))}
              </div>
            </div>
          );
        case 3:
          return (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Globe className="w-5 h-5" /> Social Profiles</h2>
                <p className="text-sm text-muted-foreground">Optional — helps others find you</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="github" className="text-sm">GitHub</Label>
                  <Input id="github" placeholder="https://github.com/..." value={github} onChange={(e) => setGithub(e.target.value)} className="mt-1" />
                </div>
              </div>
            </div>
          );
      }
    } else {
      // Organisation steps
      switch (step) {
        case 0:
          return (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">Organisation Details</h2>
                <p className="text-sm text-muted-foreground">Tell us about your organisation</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="orgname" className="text-sm">Organisation Name</Label>
                  <Input id="orgname" placeholder="e.g., TechCorp" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="orgdesc" className="text-sm">Description</Label>
                  <textarea id="orgdesc" placeholder="What does your organisation do?" value={orgDescription} onChange={(e) => setOrgDescription(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none" />
                </div>
              </div>
            </div>
          );
        case 1:
          return (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">Location & Web</h2>
                <p className="text-sm text-muted-foreground">Where are you based?</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="orgloc" className="text-sm">Location</Label>
                  <Input id="orgloc" placeholder="e.g., Bangalore" value={orgLocation} onChange={(e) => setOrgLocation(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="orgweb" className="text-sm">Website</Label>
                  <Input id="orgweb" placeholder="https://..." value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} className="mt-1" />
                </div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">Social Links</h2>
                <p className="text-sm text-muted-foreground">Optional</p>
              </div>
              <div>
                <Label htmlFor="orglinkedin" className="text-sm">LinkedIn</Label>
                <Input id="orglinkedin" placeholder="https://linkedin.com/company/..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="mt-1" />
              </div>
            </div>
          );
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 -mt-20 sm:-mt-24">
      <div className="w-full max-w-lg space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-[#ef4d23]" : "bg-muted"}`} />
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-right">
          Step {step + 1} of {totalSteps}
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-2xl border border-border shadow-lg p-6 min-h-[320px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {step > 0 && (
              <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-muted-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
              <SkipForward className="w-4 h-4 mr-1" /> Skip
            </Button>
            {step < totalSteps - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="bg-[#ef4d23] hover:bg-[#d9431d] text-white rounded-xl">
                Next <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={saving} className="bg-[#ef4d23] hover:bg-[#d9431d] text-white rounded-xl">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Finish
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

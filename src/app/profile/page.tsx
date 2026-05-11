"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import * as usersApi from "@/lib/api/users";
import { toast } from "sonner";
import { Save, MapPin, GraduationCap, Coins, Mail, Globe, Github, Linkedin } from "lucide-react";
import type { StudentProfile, OrganisationProfile } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [edits, setEdits] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-8 h-8 border-3 border-[#ef4d23]/20 border-t-[#ef4d23] rounded-full animate-spin" />
      </div>
    );
  }

  const isStudent = user?.role === "student";
  const sp = profile as StudentProfile | null;
  const op = profile as OrganisationProfile | null;

  const handleSave = async () => {
    if (Object.keys(edits).length === 0) {
      toast.info("No changes to save");
      return;
    }
    setSaving(true);
    try {
      await usersApi.updateProfile(edits);
      await refreshProfile();
      setEdits({});
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setEdits((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* Account Info */}
      <Card className="mb-6 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Mail className="w-4 h-4" /> Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Role</span>
            <Badge variant="secondary" className="capitalize">{user?.role}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Provider</span>
            <Badge variant="outline" className="capitalize">{user?.provider}</Badge>
          </div>
          {isStudent && sp && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Coin Balance</span>
              <span className="flex items-center gap-1 text-sm font-bold"><Coins className="w-4 h-4 text-amber-500" />{sp.coin_balance ?? 0}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editable Profile Fields */}
      {isStudent ? (
        <>
          <Card className="mb-6 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm">College Name</Label>
                <Input defaultValue={sp?.education?.collegeName || ""} onChange={(e) => updateField("education", { ...sp?.education, ...edits.education, collegeName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Course</Label>
                <Input defaultValue={sp?.education?.course || ""} onChange={(e) => updateField("education", { ...sp?.education, ...edits.education, course: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Graduation Year</Label>
                <Input type="number" defaultValue={sp?.education?.year_of_graduation || ""} onChange={(e) => updateField("education", { ...sp?.education, ...edits.education, year_of_graduation: parseInt(e.target.value) })} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><MapPin className="w-4 h-4" /> Location & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm">Location</Label>
                <Input defaultValue={sp?.location || ""} onChange={(e) => updateField("location", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Skills (comma-separated)</Label>
                <Input defaultValue={sp?.skills?.join(", ") || ""} onChange={(e) => updateField("skills", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm">Interested Domains (comma-separated)</Label>
                <Input defaultValue={sp?.intrested_domains?.join(", ") || ""} onChange={(e) => updateField("intrested_domains", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Globe className="w-4 h-4" /> Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm flex items-center gap-1"><Linkedin className="w-3 h-3" /> LinkedIn</Label>
                <Input defaultValue={sp?.profiles?.linkedin || ""} onChange={(e) => updateField("profiles", { ...sp?.profiles, ...edits.profiles, linkedin: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm flex items-center gap-1"><Github className="w-3 h-3" /> GitHub</Label>
                <Input defaultValue={sp?.profiles?.github || ""} onChange={(e) => updateField("profiles", { ...sp?.profiles, ...edits.profiles, github: e.target.value })} className="mt-1" />
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="mb-6 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Organisation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm">Name</Label>
              <Input defaultValue={op?.name || ""} onChange={(e) => updateField("name", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">Description</Label>
              <textarea defaultValue={op?.description || ""} onChange={(e) => updateField("description", e.target.value)}
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none" />
            </div>
            <div>
              <Label className="text-sm">Location</Label>
              <Input defaultValue={op?.location || ""} onChange={(e) => updateField("location", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">Website</Label>
              <Input defaultValue={op?.profile?.website || ""} onChange={(e) => updateField("profile", { ...op?.profile, ...edits.profile, website: e.target.value })} className="mt-1" />
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave} disabled={saving || Object.keys(edits).length === 0}
        className="w-full rounded-xl bg-[#ef4d23] hover:bg-[#d9431d] text-white">
        {saving ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
          : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>}
      </Button>
    </div>
  );
}

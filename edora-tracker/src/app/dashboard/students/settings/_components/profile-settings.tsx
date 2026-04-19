"use client";

import React, { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Loader2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "sonner";
import { getStudentProfile, createOrUpdateStudentProfile } from "@/app/actions/student-profile-actions";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink, Download } from "lucide-react";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export function ProfileSettings() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userName = user?.name ?? "";
  const userImage = (user as any)?.image ?? null;
  const nameParts = userName.split(" ");

  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") ?? "");
  const [username, setUsername] = useState(userName.toLowerCase().replace(/\s+/g, ""));
  const [image, setImage] = useState<string | null>(userImage);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    async function loadProfile() {
      const res = await getStudentProfile();
      if (res.success && res.profile) {
        setBio(res.profile.studyGoal || "");
        setLocation(res.profile.workLocationPreference || "");
        setPhoneNumber(res.profile.phoneNumber || "");
        setAddress(res.profile.address || "");
        setResumeUrl(res.profile.resumeUrl || "");
      }
    }
    loadProfile();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error: authError } = await authClient.updateUser({
        name: `${firstName} ${lastName}`.trim(),
        image: image || undefined
      });

      const profileRes = await createOrUpdateStudentProfile({
        name: `${firstName} ${lastName}`.trim(),
        studyGoal: bio,
        workLocationPreference: location,
        phoneNumber,
        address,
        resumeUrl,
      });

      if (authError) {
        toast.error(authError.message || "Failed to update basic profile");
      } else if (!profileRes.success) {
        toast.error(profileRes.error || "Failed to update student profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 ">
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>
            This will be displayed on your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="size-20">
              <AvatarImage src={image ?? undefined} alt={userName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold">
                {firstName ? initials(`${firstName} ${lastName}`) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/gif"
                onChange={handleImageUpload}
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="size-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or GIF. Max size of 2MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Study Goal / Bio</Label>
              <Textarea
                id="bio"
                placeholder="What are you currently studying or aiming for?"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Brief description of your learning journey.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location Preference</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                placeholder="123 Street, City, ZIP"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <Label>Resume / CV</Label>
                  <CardDescription>Upload your latest professional resume</CardDescription>
                </div>
                {resumeUrl ? (
                  <Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-500/20">
                    <FileText className="size-3" />
                    Attached
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-muted-foreground">None</Badge>
                )}
              </div>

              <div className="flex gap-4 items-center">
                <input
                  type="file"
                  id="resume-upload"
                  className="hidden"
                  ref={resumeInputRef}
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setResumeUrl(event.target.result as string);
                          toast.success(`Resume "${file.name}" ready!`);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resumeInputRef.current?.click()}
                >
                  <Upload className="size-4 mr-2" />
                  Replace Resume
                </Button>
                {resumeUrl && (
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="size-4 mr-2" />
                          Open in New Tab
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={resumeUrl} download="resume.pdf">
                          <Download className="size-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                    <div className="w-full aspect-[1/1.4] border border-white/10 rounded-lg overflow-hidden bg-white/5">
                      <iframe 
                        src={resumeUrl} 
                        className="w-full h-full" 
                        title="Resume Preview"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => {
          setFirstName(nameParts[0] ?? "");
          setLastName(nameParts.slice(1).join(" ") ?? "");
          setImage(userImage);
        }}>Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

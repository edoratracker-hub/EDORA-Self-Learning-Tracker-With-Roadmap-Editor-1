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
import { getMentorProfile, createOrUpdateMentorProfile } from "@/app/actions/mentor-profile-actions";

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
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [teachingProfession, setTeachingProfession] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    async function loadProfile() {
      const res = await getMentorProfile();
      if (res.success && res.profile) {
        setBio(res.profile.bio || "");
        setLocation(res.profile.location || "");
        setWebsite(res.profile.websiteUrl || "");
        setPhoneNumber(res.profile.phone || "");
        setAddress(res.profile.address || "");
        setTeachingProfession(res.profile.teachingProfession || "");
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
      // 1. Update basic auth session info (Name/Image)
      const { error: authError } = await authClient.updateUser({
        name: `${firstName} ${lastName}`.trim(),
        image: image || undefined
      });

      // 2. Update the dedicated mentorProfile row
      const mentorRes = await createOrUpdateMentorProfile({
        bio,
        location,
        websiteUrl: website,
        phone: phoneNumber,
        address,
        teachingProfession,
      });

      if (authError) {
        toast.error(authError.message || "Failed to update auth profile");
      } else if (!mentorRes.success) {
        toast.error(mentorRes.error || "Failed to update extended profile details");
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
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Brief description for your profile. Max 200 characters.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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

            <div className="space-y-2">
                <Label htmlFor="teaching">Teaching Profession</Label>
                <Input
                  id="teaching"
                  placeholder="e.g. University Professor, Online Instructor"
                  value={teachingProfession}
                  onChange={(e) => setTeachingProfession(e.target.value)}
                />
              </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
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

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, Music, Globe, Save, Camera } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getRandomUnsplashImage } from "@/utils/images";
export function SettingsInterface() {
  const [settings, setSettings] = useState({
    // Profile settings
    displayName: "",
    email: "",
    bio: "",

    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    playlistUpdates: false,
    newFollowers: true,

    // Privacy settings
    profileVisibility: "public",
    showListeningActivity: true,
    allowMessages: true,

    // Audio settings
    audioQuality: "high",
    autoplay: true,
    crossfade: false,

    // Appearance settings
    language: "en",
    region: "US",
  });

  useEffect(() => {
    let isMounted = true;
    authClient
      .getSession()
      .then((result: any) => {
        if (isMounted) {
          const user = result?.user || result?.data?.user;
          if (user) {
            setSettings((prev) => ({
              ...prev,
              displayName: user.name || "",
              email: user.email || "",
              bio: "", // No bio in session, set to empty string
            }));
          }
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          // Optionally handle error
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    console.log(" " " Saving settings:", settings);

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(" " " Settings saved successfully");
    setIsSaving(false);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl">
      {/* Profile Settings */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4 md:space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-16 w-16 md:h-20 md:w-20">
              <AvatarImage
                src={getRandomUnsplashImage()}
                className="rounded-full"
              />
              <AvatarFallback className="text-lg md:text-xl">JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-transparent"
              >
                <Camera className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
              <p className="text-xs md:text-sm text-muted-foreground">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm md:text-base">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={settings.displayName}
                onChange={(e) => updateSetting("displayName", e.target.value)}
                className="text-sm md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm md:text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting("email", e.target.value)}
                className="text-sm md:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm md:text-base">
              Bio
            </Label>
            <Input
              id="bio"
              placeholder="Tell us about yourself..."
              value={settings.bio}
              onChange={(e) => updateSetting("bio", e.target.value)}
              className="text-sm md:text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-sm md:text-base">
                Email Notifications
              </Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                updateSetting("emailNotifications", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-sm md:text-base">Push Notifications</Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                Get notified on your device
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                updateSetting("pushNotifications", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-sm md:text-base">Playlist Updates</Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                When someone updates shared playlists
              </p>
            </div>
            <Switch
              checked={settings.playlistUpdates}
              onCheckedChange={(checked) =>
                updateSetting("playlistUpdates", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-sm md:text-base">New Followers</Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                When someone follows you
              </p>
            </div>
            <Switch
              checked={settings.newFollowers}
              onCheckedChange={(checked) =>
                updateSetting("newFollowers", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm md:text-base">Profile Visibility</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) =>
                updateSetting("profileVisibility", value)
              }
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-sm md:text-base">
                Show Listening Activity
              </Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                Let others see what you're listening to
              </p>
            </div>
            <Switch
              checked={settings.showListeningActivity}
              onCheckedChange={(checked) =>
                updateSetting("showListeningActivity", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-sm md:text-base">Allow Messages</Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                Receive messages from other users
              </p>
            </div>
            <Switch
              checked={settings.allowMessages}
              onCheckedChange={(checked) =>
                updateSetting("allowMessages", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio Settings */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Music className="h-5 w-5" />
            Audio Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm md:text-base">Audio Quality</Label>
            <Select
              value={settings.audioQuality}
              onValueChange={(value) => updateSetting("audioQuality", value)}
            >
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (96 kbps)</SelectItem>
                <SelectItem value="normal">Normal (160 kbps)</SelectItem>
                <SelectItem value="high">High (320 kbps)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-sm md:text-base">Autoplay</Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                Automatically play similar songs when your music ends
              </p>
            </div>
            <Switch
              checked={settings.autoplay}
              onCheckedChange={(checked) => updateSetting("autoplay", checked)}
            />
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-sm md:text-base">Crossfade</Label>
              <p className="text-xs md:text-sm text-muted-foreground">
                Smooth transition between songs
              </p>
            </div>
            <Switch
              checked={settings.crossfade}
              onCheckedChange={(checked) => updateSetting("crossfade", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm md:text-base">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => updateSetting("language", value)}
              >
                <SelectTrigger className="text-sm md:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm md:text-base">Region</Label>
              <Select
                value={settings.region}
                onValueChange={(value) => updateSetting("region", value)}
              >
                <SelectTrigger className="text-sm md:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

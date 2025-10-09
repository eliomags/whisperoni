"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { LogoText } from "@/components/logo"
import { Camera, X } from "lucide-react"

export default function ProfileSetupPage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState(user?.name || "")
  const [location, setLocation] = useState(user?.location || "")
  const [gender, setGender] = useState(user?.gender || "male")
  const [orientation, setOrientation] = useState(user?.orientation || "straight")
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || "")

  if (!user) {
    router.push("/auth")
    return null
  }

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const canSave = name.trim() !== "" && location.trim() !== ""

  const handleSave = () => {
    if (!canSave) return

    updateProfile({
      name,
      location,
      gender,
      orientation,
      profileImageUrl: profileImageUrl || null,
    })

    toast({
      title: "Profile completed!",
      description: "Welcome to Singles Club!",
    })

    router.push("/feed")
  }

  const handleRemoveImage = () => {
    setProfileImageUrl("")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <LogoText />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-light font-serif">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              Let's set up your profile so you can start connecting with others.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>Add a profile image to personalize your account (optional).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImageUrl || undefined} alt={name} />
                  <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={profileImageUrl}
                        onChange={(e) => setProfileImageUrl(e.target.value)}
                        placeholder="Enter image URL (optional)"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    {profileImageUrl && (
                      <Button type="button" variant="outline" size="icon" onClick={handleRemoveImage} className="shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    For testing, try: https://i.pravatar.cc/150?img=1
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Tell us about yourself.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={(value: any) => setGender(value)}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <Select value={orientation} onValueChange={(value: any) => setOrientation(value)}>
                  <SelectTrigger id="orientation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="gay">Gay</SelectItem>
                    <SelectItem value="bisexual">Bisexual</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={!canSave} className="w-full" size="lg">
            <Camera className="mr-2 h-4 w-4" />
            Complete Profile & Continue
          </Button>

          {!canSave && (
            <p className="text-sm text-center text-muted-foreground">
              Please fill in all required fields (marked with *) to continue
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

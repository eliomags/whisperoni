"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/phone-input"
import { Copy, Share2, MessageCircle, Heart, Loader2, CheckCircle2 } from "lucide-react"
import { LogoText } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"

export default function SuggestMatchPage() {
  const [step, setStep] = useState<"form" | "success">("form")
  const [loading, setLoading] = useState(false)
  const [links, setLinks] = useState({ person1: "", person2: "" })
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    suggesterName: "",
    suggesterMessage: "",
    person1: { phone: "", name: "" },
    person2: { phone: "", name: "" },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/match/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setLinks(data.links)
      setStep("success")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create match. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (step === "success") {
    return <SuccessView links={links} names={{ p1: formData.person1.name, p2: formData.person2.name }} />
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <LogoText />
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full mb-4">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Play Cupid</h1>
            <p className="text-muted-foreground text-lg">
              Know two people who'd be perfect together? Connect them on Whisperoni!
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suggest a Match</CardTitle>
            <CardDescription>
              You don't need an account. Just provide their phone numbers and we'll invite them both.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Suggester Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground">Your Info (Optional)</h3>
                <div className="space-y-2">
                  <Label htmlFor="suggesterName">Your Name</Label>
                  <Input
                    id="suggesterName"
                    value={formData.suggesterName}
                    onChange={(e) => setFormData({ ...formData, suggesterName: e.target.value })}
                    placeholder="So they know who suggested this"
                  />
                </div>
              </div>

              {/* Person 1 */}
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  First Person
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="p1name">Name (Optional)</Label>
                  <Input
                    id="p1name"
                    value={formData.person1.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        person1: { ...formData.person1, name: e.target.value },
                      })
                    }
                    placeholder="Their first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p1phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <PhoneInput
                    value={formData.person1.phone}
                    onChange={(phone) =>
                      setFormData({
                        ...formData,
                        person1: { ...formData.person1, phone },
                      })
                    }
                  />
                </div>
              </div>

              {/* Person 2 */}
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  Second Person
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="p2name">Name (Optional)</Label>
                  <Input
                    id="p2name"
                    value={formData.person2.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        person2: { ...formData.person2, name: e.target.value },
                      })
                    }
                    placeholder="Their first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="p2phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <PhoneInput
                    value={formData.person2.phone}
                    onChange={(phone) =>
                      setFormData({
                        ...formData,
                        person2: { ...formData.person2, phone },
                      })
                    }
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Why do you think they'd be great together? (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.suggesterMessage}
                  onChange={(e) => setFormData({ ...formData, suggesterMessage: e.target.value })}
                  placeholder="You both love hiking, coffee, and deep conversations..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Match...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Generate Invite Links
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SuccessView({ links, names }: { links: { person1: string; person2: string }; names: { p1: string; p2: string } }) {
  const [copied1, setCopied1] = useState(false)
  const [copied2, setCopied2] = useState(false)
  const { toast } = useToast()

  const copyLink = (link: string, person: 1 | 2) => {
    navigator.clipboard.writeText(link)
    person === 1 ? setCopied1(true) : setCopied2(true)
    setTimeout(() => (person === 1 ? setCopied1(false) : setCopied2(false)), 2000)

    toast({
      title: "Link copied!",
      description: "Share it with your friend",
    })
  }

  const shareViaWhatsApp = (link: string, name: string) => {
    const message = `Hey${name ? ` ${name}` : ""}! A friend thinks we'd be a great match. Check this out: ${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  const shareViaSMS = (link: string, name: string) => {
    const message = `Hey${name ? ` ${name}` : ""}! A friend thinks we'd be a great match: ${link}`
    window.location.href = `sms:?body=${encodeURIComponent(message)}`
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Match Created!</h1>
          <p className="text-muted-foreground">Share these unique links with each person</p>
        </div>

        {/* Person 1 Link */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">For {names.p1 || "Person 1"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted rounded font-mono text-sm break-all">{links.person1}</div>
            <div className="flex gap-2">
              <Button onClick={() => copyLink(links.person1, 1)} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                {copied1 ? "Copied!" : "Copy"}
              </Button>
              <Button onClick={() => shareViaWhatsApp(links.person1, names.p1)} variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button onClick={() => shareViaSMS(links.person1, names.p1)} variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                SMS
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Person 2 Link */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">For {names.p2 || "Person 2"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted rounded font-mono text-sm break-all">{links.person2}</div>
            <div className="flex gap-2">
              <Button onClick={() => copyLink(links.person2, 2)} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                {copied2 ? "Copied!" : "Copy"}
              </Button>
              <Button onClick={() => shareViaWhatsApp(links.person2, names.p2)} variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button onClick={() => shareViaSMS(links.person2, names.p2)} variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                SMS
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ( Both people will be notified when they both join Whisperoni
          </p>
          <p className="text-sm text-muted-foreground">= These links never expire</p>
        </div>
      </div>
    </div>
  )
}

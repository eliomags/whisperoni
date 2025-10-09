"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneInput } from "@/components/phone-input"
import { VerificationCodeInput } from "@/components/verification-code-input"
import { LogoText } from "@/components/logo"
import { useAuth, VERIFICATION_CODES } from "@/lib/auth-context"
import { ArrowLeft } from "lucide-react"

export default function AuthPage() {
  const [step, setStep] = useState<"phone" | "code">("phone")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const { login, needsProfileSetup } = useAuth()
  const router = useRouter()

  const handleSendCode = () => {
    if (!phone) {
      setError("Please enter your phone number")
      return
    }

    // Check if phone exists in dummy data
    if (!VERIFICATION_CODES[phone]) {
      setError("Phone number not found. Try: +1234567890, +1234567891, or +1234567892")
      return
    }

    setError("")
    setStep("code")
  }

  const handleVerifyCode = async (code: string) => {
    const success = await login(phone, code)
    if (success) {
      // Check if user needs to complete profile setup
      if (needsProfileSetup) {
        router.push("/profile-setup")
      } else {
        router.push("/feed")
      }
    } else {
      setError("Invalid verification code. Try: 123456")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md mb-4 flex gap-2">
        <Link href="/" className="flex-1">
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/feed" className="flex-1">
          <Button variant="outline" className="w-full bg-transparent">
            View Feed
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <LogoText />
          </div>
          <div>
            <CardTitle className="text-2xl font-light">Welcome</CardTitle>
            <CardDescription className="text-base">
              {step === "phone" ? "Enter your phone number to get started" : "Verify your phone number"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "phone" ? (
            <>
              <PhoneInput value={phone} onChange={setPhone} error={error} />
              <Button onClick={handleSendCode} className="w-full" size="lg">
                Send Code
              </Button>
              <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded-lg">
                <p className="font-semibold">Test Numbers:</p>
                <p>+1234567890 (Alex)</p>
                <p>+1234567891 (Sarah)</p>
                <p>+1234567892 (Admin)</p>
                <p>+1111111111 (New User - Profile Setup)</p>
                <p className="mt-2">Code: 123456</p>
              </div>
            </>
          ) : (
            <>
              <VerificationCodeInput onComplete={handleVerifyCode} error={error} />
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("phone")
                  setError("")
                }}
                className="w-full"
              >
                Change Phone Number
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

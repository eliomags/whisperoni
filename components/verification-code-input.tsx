"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type VerificationCodeInputProps = {
  length?: number
  onComplete: (code: string) => void
  error?: string
}

export function VerificationCodeInput({ length = 6, onComplete, error }: VerificationCodeInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount with a slight delay to ensure ref is set
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return

    // Handle paste or multiple characters
    if (value.length > 1) {
      const digits = value.slice(0, length).split('')
      const newCode = [...code]
      digits.forEach((digit, i) => {
        if (index + i < length && /^\d$/.test(digit)) {
          newCode[index + i] = digit
        }
      })
      setCode(newCode)

      // Focus the next empty field or last field
      const nextIndex = Math.min(index + digits.length, length - 1)
      requestAnimationFrame(() => {
        inputRefs.current[nextIndex]?.focus()
      })

      // Check if complete
      if (newCode.every((digit) => digit !== "")) {
        onComplete(newCode.join(""))
      }
      return
    }

    // Single character entry
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Move to next input automatically
    if (value && index < length - 1) {
      requestAnimationFrame(() => {
        inputRefs.current[index + 1]?.focus()
      })
    }

    // Check if complete
    if (newCode.every((digit) => digit !== "")) {
      onComplete(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // If current field is empty, move to previous field
        e.preventDefault()
        const newCode = [...code]
        newCode[index - 1] = ""
        setCode(newCode)
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current field
        const newCode = [...code]
        newCode[index] = ""
        setCode(newCode)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    if (!/^\d+$/.test(pastedData)) return

    const newCode = [...code]
    pastedData.split("").forEach((char, i) => {
      if (i < length) newCode[i] = char
    })
    setCode(newCode)

    if (newCode.every((digit) => digit !== "")) {
      onComplete(newCode.join(""))
    }
  }

  return (
    <div className="space-y-3">
      <Label>Verification Code</Label>
      <div className="flex gap-2 justify-center">
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            autoFocus={index === 0}
            className="w-12 h-12 text-center text-lg font-semibold"
          />
        ))}
      </div>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <p className="text-xs text-muted-foreground text-center">Enter the 6-digit code sent to your phone</p>
    </div>
  )
}

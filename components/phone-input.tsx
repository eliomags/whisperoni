"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PhoneInputProps = {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  error?: string
}

export function PhoneInput({
  value,
  onChange,
  label = "Phone Number",
  placeholder = "+1 (555) 000-0000",
  error,
}: PhoneInputProps) {
  const formatPhoneNumber = (input: string) => {
    // Remove all non-numeric characters except +
    const cleaned = input.replace(/[^\d+]/g, "")
    return cleaned
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    onChange(formatted)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">{label}</Label>
      <Input
        id="phone"
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

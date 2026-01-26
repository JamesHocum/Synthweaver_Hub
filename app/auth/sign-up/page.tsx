"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, User, Zap, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        data: {
          username,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div
          className="w-full max-w-md p-8 rounded-2xl border bg-[#12121a] text-center"
          style={{
            borderColor: "var(--neon-primary)",
            boxShadow: `0 0 30px calc(var(--neon-intensity) * 0.3) var(--neon-primary)`,
          }}
        >
          <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--neon-primary)" }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--neon-primary)" }}>
            Check your email
          </h2>
          <p className="text-gray-400 mb-6">
            {"We've sent you a confirmation link. Click it to activate your account."}
          </p>
          <Link href="/auth/login">
            <Button
              className="w-full"
              style={{
                backgroundColor: "var(--neon-primary)",
                color: "#0a0a0f",
              }}
            >
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div
        className="w-full max-w-md p-8 rounded-2xl border bg-[#12121a]"
        style={{
          borderColor: "var(--neon-primary)",
          boxShadow: `0 0 30px calc(var(--neon-intensity) * 0.3) var(--neon-primary)`,
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/images/brand-logo.png" alt="Synthweaver Hub" width={48} height={48} className="rounded-lg" />
            <h1
              className="text-2xl font-bold"
              style={{
                color: "var(--neon-primary)",
                textShadow: `0 0 20px var(--neon-primary)`,
              }}
            >
              Synthweaver Hub
            </h1>
          </div>
          <p className="text-gray-400 text-sm">Create your account</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="username"
                type="text"
                placeholder="synthweaver"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-10 bg-[#1a1a24] border-gray-700 text-white placeholder:text-gray-500 focus:border-[var(--neon-primary)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-[#1a1a24] border-gray-700 text-white placeholder:text-gray-500 focus:border-[var(--neon-primary)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 bg-[#1a1a24] border-gray-700 text-white placeholder:text-gray-500 focus:border-[var(--neon-primary)]"
              />
            </div>
            <p className="text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full font-semibold"
            style={{
              backgroundColor: "var(--neon-primary)",
              color: "#0a0a0f",
            }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="hover:underline" style={{ color: "var(--neon-primary)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

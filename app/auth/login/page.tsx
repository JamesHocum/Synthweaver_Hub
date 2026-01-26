"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, Zap } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirect)
      router.refresh()
    }
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
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">{error}</div>
          )}

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
                className="pl-10 bg-[#1a1a24] border-gray-700 text-white placeholder:text-gray-500 focus:border-[var(--neon-primary)]"
              />
            </div>
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
                Sign In
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {"Don't have an account? "}
          <Link href="/auth/sign-up" className="hover:underline" style={{ color: "var(--neon-primary)" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Github,
  Box,
  Puzzle,
  Settings,
  LogOut,
  Plus,
  RefreshCw,
  ExternalLink,
  Star,
  GitFork,
  Download,
  Heart,
  Loader2,
  FolderGit2,
  Brain,
  Plug,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
}

interface Integration {
  id: string
  provider: string
  provider_username: string | null
  connected_at: string
  last_sync_at: string | null
  is_active: boolean
}

interface Repository {
  id: string
  repo_name: string
  repo_full_name: string
  description: string | null
  is_private: boolean
  language: string | null
  stars_count: number
  forks_count: number
  url: string | null
}

interface Model {
  id: string
  model_name: string
  author: string | null
  description: string | null
  pipeline_tag: string | null
  downloads: number
  likes: number
  url: string | null
}

interface DashboardClientProps {
  user: SupabaseUser
  profile: Profile | null
  integrations: Integration[]
  repositories: Repository[]
  models: Model[]
  initialTab?: string
}

// Format relative time for last synced
function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "Never"
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function DashboardClient({ user, profile, integrations, repositories, models, initialTab }: DashboardClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [syncing, setSyncing] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [lastSyncTimes, setLastSyncTimes] = useState<Record<string, string | null>>({})
  
  // Get current tab from URL or default to integrations
  const currentTab = searchParams.get("tab") || initialTab || "integrations"
  
  // Check for connection success messages
  const connected = searchParams.get("connected")
  const error = searchParams.get("error")

  useEffect(() => {
    // Update last sync times from integrations
    const times: Record<string, string | null> = {}
    integrations.forEach(i => {
      times[i.provider] = i.last_sync_at
    })
    setLastSyncTimes(times)
  }, [integrations])

  const handleTabChange = (value: string) => {
    // Update URL with new tab
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    // Remove connection status params when switching tabs
    params.delete("connected")
    params.delete("error")
    router.push(`/dashboard?${params.toString()}`)
  }

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push("/")
    router.refresh()
  }

  const githubIntegration = integrations.find((i) => i.provider === "github")
  const huggingfaceIntegration = integrations.find((i) => i.provider === "huggingface")

  const handleConnectGitHub = async () => {
    setConnecting("github")
    // Redirect to GitHub OAuth
    window.location.href = "/api/auth/github"
  }

  const handleConnectHuggingFace = async () => {
    setConnecting("huggingface")
    // Redirect to Hugging Face OAuth
    window.location.href = "/api/auth/huggingface"
  }

  const handleSyncGitHub = async () => {
    if (!githubIntegration) return
    setSyncing("github")
    try {
      const res = await fetch("/api/integrations/github/sync", {
        method: "POST",
      })
      if (res.ok) {
        // Update last sync time locally for immediate feedback
        setLastSyncTimes(prev => ({ ...prev, github: new Date().toISOString() }))
        router.refresh()
      }
    } finally {
      setSyncing(null)
    }
  }

  const handleSyncHuggingFace = async () => {
    if (!huggingfaceIntegration) return
    setSyncing("huggingface")
    try {
      const res = await fetch("/api/integrations/huggingface/sync", {
        method: "POST",
      })
      if (res.ok) {
        // Update last sync time locally for immediate feedback
        setLastSyncTimes(prev => ({ ...prev, huggingface: new Date().toISOString() }))
        router.refresh()
      }
    } finally {
      setSyncing(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Dashboard Header */}
      <header className="border-b px-6 py-4" style={{ borderColor: "rgba(var(--neon-primary-rgb), 0.3)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/brand-logo.png" alt="Synthweaver Hub" width={40} height={40} className="rounded-lg" />
            <span
              className="text-xl font-bold"
              style={{
                color: "var(--neon-primary)",
                textShadow: `0 0 15px var(--neon-primary)`,
              }}
            >
              Synthweaver Hub
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Plug className="h-5 w-5" />
              <span>{profile?.username || user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Connection Status Banner */}
        {connected && (
          <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: "rgba(var(--neon-primary-rgb), 0.1)", border: "1px solid var(--neon-primary)" }}>
            <CheckCircle2 className="h-5 w-5" style={{ color: "var(--neon-primary)" }} />
            <span className="text-white">Successfully connected! Your data will sync automatically.</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-white">Connection failed: {error.replace(/_/g, " ")}</span>
          </div>
        )}

        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList
            className="w-full justify-start bg-[#12121a] border mb-6 overflow-x-auto"
            style={{ borderColor: "rgba(var(--neon-primary-rgb), 0.3)" }}
          >
            <TabsTrigger
              value="integrations"
              className="data-[state=active]:bg-[var(--neon-primary)] data-[state=active]:text-[#0a0a0f]"
            >
              <Plug className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger
              value="repositories"
              className="data-[state=active]:bg-[var(--neon-primary)] data-[state=active]:text-[#0a0a0f]"
            >
              <FolderGit2 className="h-4 w-4 mr-2" />
              Repositories
              {repositories.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-700">{repositories.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="models"
              className="data-[state=active]:bg-[var(--neon-primary)] data-[state=active]:text-[#0a0a0f]"
            >
              <Brain className="h-4 w-4 mr-2" />
              Models
              {models.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-700">{models.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="extensions"
              className="data-[state=active]:bg-[var(--neon-primary)] data-[state=active]:text-[#0a0a0f]"
            >
              <Puzzle className="h-4 w-4 mr-2" />
              Extensions
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-[var(--neon-primary)] data-[state=active]:text-[#0a0a0f]"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Connected Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* GitHub Integration Card */}
              <div
                className="p-6 rounded-xl border bg-[#12121a]"
                style={{
                  borderColor: githubIntegration ? "var(--neon-primary)" : "rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-800">
                      <Github className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">GitHub</h3>
                      <p className="text-sm text-gray-400">
                        {githubIntegration ? `@${githubIntegration.provider_username}` : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {githubIntegration && (
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: "rgba(var(--neon-primary-rgb), 0.2)",
                        color: "var(--neon-primary)",
                      }}
                    >
                      Connected
                    </span>
                  )}
                </div>
                {githubIntegration && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Clock className="h-3 w-3" />
                    <span>Last synced: {formatRelativeTime(lastSyncTimes.github)}</span>
                  </div>
                )}
                {githubIntegration ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSyncGitHub}
                      disabled={syncing === "github"}
                      className="flex-1"
                      style={{
                        backgroundColor: "var(--neon-primary)",
                        color: "#0a0a0f",
                      }}
                    >
                      {syncing === "github" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnectGitHub}
                    disabled={connecting === "github"}
                    className="w-full"
                    style={{
                      backgroundColor: "var(--neon-primary)",
                      color: "#0a0a0f",
                    }}
                  >
                    {connecting === "github" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Connect GitHub
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Hugging Face Integration Card */}
              <div
                className="p-6 rounded-xl border bg-[#12121a]"
                style={{
                  borderColor: huggingfaceIntegration ? "var(--neon-primary)" : "rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/20">
                      <Box className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Hugging Face</h3>
                      <p className="text-sm text-gray-400">
                        {huggingfaceIntegration ? `@${huggingfaceIntegration.provider_username}` : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {huggingfaceIntegration && (
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: "rgba(var(--neon-primary-rgb), 0.2)",
                        color: "var(--neon-primary)",
                      }}
                    >
                      Connected
                    </span>
                  )}
                </div>
                {huggingfaceIntegration && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Clock className="h-3 w-3" />
                    <span>Last synced: {formatRelativeTime(lastSyncTimes.huggingface)}</span>
                  </div>
                )}
                {huggingfaceIntegration ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSyncHuggingFace}
                      disabled={syncing === "huggingface"}
                      className="flex-1"
                      style={{
                        backgroundColor: "var(--neon-primary)",
                        color: "#0a0a0f",
                      }}
                    >
                      {syncing === "huggingface" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnectHuggingFace}
                    disabled={connecting === "huggingface"}
                    className="w-full"
                    style={{
                      backgroundColor: "var(--neon-primary)",
                      color: "#0a0a0f",
                    }}
                  >
                    {connecting === "huggingface" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Connect Hugging Face
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* More Integrations Coming Soon */}
              <div className="p-6 rounded-xl border border-dashed border-gray-700 bg-[#12121a]/50 flex flex-col items-center justify-center text-center">
                <Puzzle className="h-8 w-8 text-gray-500 mb-2" />
                <h3 className="font-semibold text-gray-400">More Coming Soon</h3>
                <p className="text-sm text-gray-500 mt-1">Firebase, Figma, CodeMagic, and more</p>
              </div>
            </div>
          </TabsContent>

          {/* Repositories Tab */}
          <TabsContent value="repositories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Synced Repositories</h2>
              {githubIntegration && (
                <Button
                  onClick={handleSyncGitHub}
                  disabled={syncing === "github"}
                  style={{
                    backgroundColor: "var(--neon-primary)",
                    color: "#0a0a0f",
                  }}
                >
                  {syncing === "github" ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Repositories
                </Button>
              )}
            </div>

            {repositories.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
                <FolderGit2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">No repositories synced</h3>
                <p className="text-gray-500 mt-2">
                  {githubIntegration
                    ? 'Click "Sync Repositories" to import your repos'
                    : "Connect GitHub to sync your repositories"}
                </p>
                {!githubIntegration && (
                  <Button
                    onClick={handleConnectGitHub}
                    className="mt-4"
                    style={{
                      backgroundColor: "var(--neon-primary)",
                      color: "#0a0a0f",
                    }}
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Connect GitHub
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-4 rounded-xl border bg-[#12121a] hover:border-[var(--neon-primary)] transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold" style={{ color: "var(--neon-primary)" }}>
                            {repo.repo_name}
                          </h3>
                          {repo.is_private && (
                            <span className="px-2 py-0.5 text-xs rounded bg-gray-700 text-gray-300">Private</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {repo.description || "No description"}
                        </p>
                      </div>
                      {repo.url && (
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-blue-500" />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stars_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Synced Models</h2>
              {huggingfaceIntegration && (
                <Button
                  onClick={handleSyncHuggingFace}
                  disabled={syncing === "huggingface"}
                  style={{
                    backgroundColor: "var(--neon-primary)",
                    color: "#0a0a0f",
                  }}
                >
                  {syncing === "huggingface" ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sync Models
                </Button>
              )}
            </div>

            {models.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
                <Brain className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">No models synced</h3>
                <p className="text-gray-500 mt-2">
                  {huggingfaceIntegration
                    ? 'Click "Sync Models" to import your HF models'
                    : "Connect Hugging Face to sync your models"}
                </p>
                {!huggingfaceIntegration && (
                  <Button
                    onClick={handleConnectHuggingFace}
                    className="mt-4"
                    style={{
                      backgroundColor: "var(--neon-primary)",
                      color: "#0a0a0f",
                    }}
                  >
                    <Box className="h-4 w-4 mr-2" />
                    Connect Hugging Face
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="p-4 rounded-xl border bg-[#12121a] hover:border-[var(--neon-primary)] transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: "var(--neon-primary)" }}>
                          {model.model_name}
                        </h3>
                        <p className="text-sm text-gray-500">by {model.author}</p>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {model.description || "No description"}
                        </p>
                      </div>
                      {model.url && (
                        <a
                          href={model.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      {model.pipeline_tag && (
                        <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-300">{model.pipeline_tag}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {model.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {model.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Extensions Tab */}
          <TabsContent value="extensions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Extension Marketplace</h2>
              <Button variant="outline" className="border-gray-700 text-gray-300 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Submit Extension
              </Button>
            </div>

            <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
              <Puzzle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400">Marketplace Coming Soon</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Browse, install, and manage extensions to customize your Synthweaver experience. Tool signing suite and
                verification system in development.
              </p>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>

            <div className="p-6 rounded-xl border bg-[#12121a]" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <h3 className="font-semibold text-white mb-4">Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Username</label>
                  <p className="text-white">{profile?.username || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Member since</label>
                  <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
              <h3 className="font-semibold text-red-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-400 mb-4">Permanently delete your account and all associated data.</p>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

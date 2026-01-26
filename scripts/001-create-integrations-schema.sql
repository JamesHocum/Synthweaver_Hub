-- Synthweaver Hub Database Schema
-- User integrations and connected services

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connected integrations for each user
CREATE TABLE IF NOT EXISTS public.user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'github', 'huggingface', 'firebase', 'figma', etc.
  provider_user_id TEXT,
  provider_username TEXT,
  access_token TEXT, -- encrypted in production
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[],
  metadata JSONB DEFAULT '{}',
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, provider)
);

-- Synced repositories from GitHub/GitLab/etc
CREATE TABLE IF NOT EXISTS public.synced_repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES public.user_integrations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  repo_id TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  repo_full_name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  default_branch TEXT DEFAULT 'main',
  language TEXT,
  stars_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  url TEXT,
  clone_url TEXT,
  metadata JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider, repo_id)
);

-- Synced models from Hugging Face
CREATE TABLE IF NOT EXISTS public.synced_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES public.user_integrations(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  model_name TEXT NOT NULL,
  author TEXT,
  description TEXT,
  pipeline_tag TEXT,
  tags TEXT[],
  downloads INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  url TEXT,
  metadata JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, model_id)
);

-- User installed extensions
CREATE TABLE IF NOT EXISTS public.user_extensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  extension_id TEXT NOT NULL,
  extension_name TEXT NOT NULL,
  version TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, extension_id)
);

-- Extension marketplace catalog
CREATE TABLE IF NOT EXISTS public.extensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES public.profiles(id),
  author_name TEXT,
  icon_url TEXT,
  version TEXT DEFAULT '1.0.0',
  category TEXT,
  tags TEXT[],
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  manifest JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synced_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synced_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_extensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extensions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_integrations
CREATE POLICY "Users can view own integrations" ON public.user_integrations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own integrations" ON public.user_integrations
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for synced_repositories
CREATE POLICY "Users can view own repos" ON public.synced_repositories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own repos" ON public.synced_repositories
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for synced_models
CREATE POLICY "Users can view own models" ON public.synced_models
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own models" ON public.synced_models
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_extensions
CREATE POLICY "Users can view own extensions" ON public.user_extensions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own extensions" ON public.user_extensions
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for extensions (public read, author write)
CREATE POLICY "Anyone can view published extensions" ON public.extensions
  FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Authors can manage own extensions" ON public.extensions
  FOR ALL USING (auth.uid() = author_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON public.user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_provider ON public.user_integrations(provider);
CREATE INDEX IF NOT EXISTS idx_synced_repositories_user_id ON public.synced_repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_synced_models_user_id ON public.synced_models(user_id);
CREATE INDEX IF NOT EXISTS idx_extensions_category ON public.extensions(category);
CREATE INDEX IF NOT EXISTS idx_extensions_slug ON public.extensions(slug);

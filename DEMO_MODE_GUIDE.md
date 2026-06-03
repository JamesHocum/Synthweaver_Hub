# Demo Mode - Visual Guide & Quick Start

## Quick Start (30 seconds)

1. **Visit the landing page** → http://localhost:3000
2. **Click "Try Demo Mode"** button (below the CTA buttons)
3. **Follow the spotlight** highlighting each feature
4. **Use Next/Back buttons** or arrow keys to navigate
5. **Press Esc anytime** to exit

---

## What You'll See

### Step-by-Step Visual Flow

```
LANDING PAGE
├─ Step 1: Hero Title Highlighted
│  └─ Tooltip: "Welcome to Synthweaver Hub"
│  
├─ Step 2: CTA Buttons Highlighted
│  └─ Tooltip: Explains Get Started & GitHub buttons
│  
├─ Step 3: Features Section Highlighted
│  └─ Tooltip: Overview of 8 key features
│  
├─ Step 4: Theme Controls Highlighted
│  └─ Tooltip: Explains Cyber/Synth/Hybrid themes
│  
├─ Step 5: Intensity Slider Highlighted
│  └─ Tooltip: Explains neon glow customization
│  
├─ Step 6: Integrations Section Highlighted
│  └─ Tooltip: Integration partners overview
│  
DASHBOARD (Accessed without login)
├─ Step 7: Dashboard Header Highlighted
│  └─ Tooltip: Welcome to management interface
│  
├─ Step 8: Integrations Tab Highlighted
│  └─ Tooltip: Connected services view
│  
├─ Step 9: GitHub Card Highlighted
│  └─ Tooltip: GitHub integration details
│  
├─ Step 10: Hugging Face Card Highlighted
│  └─ Tooltip: Hugging Face integration details
│  
├─ Step 11: Repositories Tab Highlighted
│  └─ Tooltip: Repository browser
│  
├─ Step 12: Repository Grid Highlighted
│  └─ Tooltip: Sample repositories showcase
│  
├─ Step 13: Models Tab Highlighted
│  └─ Tooltip: AI models browser
│  
├─ Step 14: Models Grid Highlighted
│  └─ Tooltip: Sample AI models showcase
│  
└─ Step 15: Extensions Tab Highlighted
   └─ Tooltip: Extension marketplace overview
```

---

## UI Elements Explained

### Spotlight Effect
```
┌─────────────────────────────────┐
│     DIMMED BACKGROUND           │
│   (semi-transparent overlay)    │
│                                 │
│    ┌──────────────────────┐    │
│    │   NEON SPOTLIGHT     │    │
│    │  (highlighted div)   │    │
│    │   with glow effect   │    │
│    └──────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### Tooltip Card
```
┌──────────────────────────────────┐
│  1/15  Demo Mode                │
├──────────────────────────────────┤
│  Welcome to Synthweaver Hub      │
│                                  │
│  A next-generation repository    │
│  platform combining GitHub,      │
│  Hugging Face, and AI-powered    │
│  tools. Let's take a tour!       │
│                                  │
│  ┌─ Navigate  🎮 Esc Exit ─┐   │
│  │  ← Back  |Skip|  Next →  │   │
│  └────────────────────────────┘   │
└──────────────────────────────────┘
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **→** | Next step |
| **←** | Previous step |
| **N** | Next step (alternative) |
| **P** | Previous step (alternative) |
| **Esc** | Exit demo |
| **S** | Skip to end |
| **Enter** | Activate focused button |

---

## Theme-Aware Colors

The demo automatically adapts to your selected theme:

### Cyber Theme (Blue/Cyan)
```
Spotlight Color: #00ffff (Cyan)
Text Color: White
Background: Dark with cyan glow
```

### Synth Theme (Orange/Pink) 
```
Spotlight Color: #ff6b35 (Orange)
Text Color: White
Background: Dark with orange glow
```

### Hybrid Theme (Purple)
```
Spotlight Color: #9d4edd (Purple)
Text Color: White
Background: Dark with purple glow
```

---

## Demo Mode Badge (Dashboard)

When you reach the dashboard steps (7-15), you'll see a pulsing badge:

```
┌─────────────────────────────────┐
│  🔴 Demo Mode    [Exit Demo]     │
└─────────────────────────────────┘
```

Click "Exit Demo" or press Esc to return to the home page.

---

## Sample Data Overview

### GitHub Repositories (5 total)
- **react-dashboard-ui** - 2.4k ⭐ • TypeScript
- **machine-learning-pipeline** - 1.8k ⭐ • Python
- **cloud-sync-service** - 3.2k ⭐ • Go
- **web-performance-tools** - 945 ⭐ • JavaScript
- **mobile-app-framework** - 1.5k ⭐ • Rust

### Hugging Face Models (8 total)
- Llama-3-70B (5.2M downloads)
- Mistral-7B (3.8M downloads)
- Whisper-Large (2.1M downloads)
- CodeLlama-34B (1.9M downloads)
- Stable-Diffusion-XL (890k downloads)
- Vision-Transformer (456k downloads)
- BERT-Multilingual (234k downloads)
- GPT-2 (123k downloads)

---

## Desktop Experience

### Landing Page
```
┌──────────────────────────────────────────┐
│ Logo │ Features │ Integrations │ Docs   │
│        Cyber | Synth | Hybrid | 100%   │
├──────────────────────────────────────────┤
│                                          │
│         🎯 HERO SECTION (Highlighted)   │
│      Synthweaver Hub (with glow)        │
│                                          │
│    [Get Started] [View on GitHub]       │
│    [▶ Try Demo Mode (Interactive Tour)] │
│                                          │
│         Features, Integrations, etc.    │
│                                          │
└──────────────────────────────────────────┘
```

### Dashboard (Demo Mode)
```
┌──────────────────────────────────────────┐
│ 🔴 Demo Mode    [Exit Demo]   Logo       │
├──────────────────────────────────────────┤
│ Integrations | Repositories | Models | Extensions │ Settings
├──────────────────────────────────────────┤
│                                          │
│    [Connected Integrations Grid]        │
│    (GitHub and HF cards highlighted)    │
│                                          │
│    [Repository List]                    │
│    (Showing sample repos)               │
│                                          │
└──────────────────────────────────────────┘
```

---

## Mobile Experience

### Mobile Landing
```
┌──────────────┐
│ Logo | Menu  │
├──────────────┤
│              │
│ Synthweaver  │
│     Hub      │
│              │
│  [Get Start] │
│  [View Repo] │
│  [Try Demo]  │
│ (highlighted)│
│              │
│  Features... │
│              │
└──────────────┘
```

### Mobile Dashboard
```
┌──────────────┐
│ 🔴 Demo Mode │
│ [Exit Demo]  │
├──────────────┤
│ Integrations │
│ Repos | Mods │
│ Ext. | Sett. │
├──────────────┤
│  Integration │
│   Cards...   │
│              │
└──────────────┘
```

---

## Common Interactions

### Starting the Demo
```
1. Land on http://localhost:3000
2. Scroll down to see "Try Demo Mode" button
3. Click the button
4. Spotlight appears on hero title
5. Tooltip explains the first step
```

### Navigating Steps
```
Option 1: Click Next button
  - Tooltip animates away
  - Page auto-scrolls if needed
  - Spotlight moves to next element
  - New tooltip appears

Option 2: Press Right Arrow key
  - Same effect as clicking Next
  - Faster keyboard navigation

Option 3: Click Skip button
  - Jump to final step (Extensions Tab)
  - Can still use Back to go through steps
```

### Exiting Demo
```
Option 1: Press Esc key
  - Demo mode immediately exits
  - Overlay disappears
  - Can interact with page normally

Option 2: Click Exit Demo button (dashboard)
  - Exits demo mode
  - Redirects to home page
  
Option 3: Complete all 15 steps
  - Final step shows Extensions Tab
  - Can continue or exit
```

---

## Tips & Tricks

### Get the Most from Demo

✓ **Use keyboard navigation** - Arrow keys are faster than clicking
✓ **Check all themes** - Try Cyber, Synth, and Hybrid to see different glows
✓ **Adjust glow intensity** - Step 5 shows the intensity slider
✓ **Explore dashboard** - After step 7, you can interact with dashboard
✓ **Read the tooltips** - Each step has helpful information
✓ **Take your time** - Use Back button to reread steps
✓ **Visit dashboard** - See realistic sample data for repos and models

### Troubleshooting

**Q: Demo doesn't start**
- A: Check that you clicked "Try Demo Mode" (below CTA buttons)
- A: Try refreshing the page

**Q: Spotlight is off-screen**
- A: Page will auto-scroll to ensure element is visible
- A: If not, try clicking Next to move to next step

**Q: Can't exit demo**
- A: Press Esc key to exit anytime
- A: Or click "Exit Demo" button on dashboard

**Q: Demo overlays not showing**
- A: Check browser console for errors
- A: Try reloading the page
- A: Clear browser cache and reload

---

## Feature Highlights During Demo

The demo showcases these key Synthweaver features:

1. **Stunning Neon UI** - Visual theme customization
2. **GitHub Integration** - Repository sync showcase
3. **Hugging Face Integration** - AI model management
4. **Dashboard Interface** - Centralized management hub
5. **Repository Browser** - Browse synced repos with details
6. **Model Browser** - Explore AI models
7. **Extensions Marketplace** - Plugin ecosystem
8. **Theme System** - Multiple visual themes
9. **Glow Controls** - Customizable neon effects
10. **Responsive Design** - Works on all devices

---

## Next Steps After Demo

### To Get Started
- Click "Get Started" button
- Sign up for an account
- Connect GitHub account
- Connect Hugging Face account
- Start managing repositories and models

### To Learn More
- Visit the Features section
- Check the Integrations section
- Read project documentation
- Explore dashboard features

### To Contribute
- Visit GitHub repository
- Check contribution guidelines
- Submit issues or PRs

---

## Performance Notes

- Demo mode has **zero performance impact** on the app
- Spotlight uses **CSS animations** (GPU accelerated)
- Tooltip positioning is **optimized** for smooth scrolling
- Demo state is **lightweight** (minimal memory usage)
- Navigation is **instant** (no loading delays)

---

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✓ Full | Recommended |
| Firefox 88+ | ✓ Full | Excellent |
| Safari 14+ | ✓ Full | Works great |
| Edge 90+ | ✓ Full | Based on Chrome |
| Mobile Safari | ✓ Full | iOS 14+ |
| Chrome Mobile | ✓ Full | Android 10+ |

---

## Feedback & Improvements

The demo mode is designed to be improved over time. Features that could be added:

- Analytics tracking (which steps are most viewed)
- Auto-play mode with timed progression
- Video overlays for complex features
- Different demos for different user types
- Feedback collection after demo
- Integration with signup flow

---

## Conclusion

**Demo Mode transforms Synthweaver Hub into an engaging, self-guided platform tour** that:

✅ Requires no authentication
✅ Takes 5-10 minutes to complete
✅ Showcases key features effectively
✅ Works on all devices
✅ Adapts to all themes
✅ Provides keyboard navigation
✅ Offers manual step-through control
✅ Includes realistic sample data

**Perfect for onboarding new users and demonstrating platform capabilities!**

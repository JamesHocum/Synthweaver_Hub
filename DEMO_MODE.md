# Demo Mode Feature Documentation

## Overview

Demo Mode is an interactive walkthrough system that guides new users through Synthweaver Hub's key features and capabilities. It provides a one-click introduction to the platform without requiring authentication.

## Features

### 1. **Spotlight Highlighting System**
- Highlights individual UI elements with neon-bordered spotlights
- Dimmed background to focus attention on highlighted elements
- Smooth transitions between elements
- Mobile-friendly positioning with viewport adjustments

### 2. **Interactive Guided Walkthrough**
- 15-step guided tour covering:
  - Landing page introduction
  - Theme system showcase (Cyber, Synth, Hybrid themes)
  - Glow intensity controls
  - Key features overview
  - Integration capabilities
  - Dashboard navigation
  - Repository management interface
  - AI model browser
  - Extension marketplace
- Auto-scrolling to highlighted elements
- Keyboard navigation support

### 3. **Demo Context System**
- Global state management for demo state
- Easy integration with any component
- Persistent demo data throughout the walkthrough
- Context Provider wraps entire app

### 4. **Sample Data**
- Realistic mock data for GitHub repositories
- Hugging Face model examples
- Integration showcase data
- Demonstrates the full platform capabilities

### 5. **Navigation Controls**
- Back/Next buttons for manual navigation
- Skip option to exit demo at any time
- Keyboard shortcuts: Navigate with arrow keys, Exit with Esc
- Progress indicator (e.g., "1/15 Demo Mode")

## Usage

### Starting Demo Mode

**For End Users:**
1. Click the "Try Demo Mode" button on the landing page
2. Follow the interactive walkthrough
3. Use Next/Back buttons to navigate
4. Press Esc or click Skip to exit at any time

**For Developers:**
```typescript
import { useDemoMode } from "@/contexts/demo-mode-context"

function MyComponent() {
  const { startDemo, isDemoMode, currentStep } = useDemoMode()
  
  return (
    <>
      <button onClick={startDemo}>Start Demo</button>
      {isDemoMode && <DemoIndicator />}
    </>
  )
}
```

### Adding Elements to Demo

Mark elements for demo highlighting with `data-demo` attributes:

```tsx
<div data-demo="hero-title">Welcome to Synthweaver</div>
<div data-demo="theme-controls">Theme selector</div>
<div data-demo="repositories-tab">Repo management</div>
```

The demo system automatically detects these elements and highlights them in sequence.

## Architecture

### Files Created/Modified

#### New Files:
- `contexts/demo-mode-context.tsx` - Demo state management
- `components/demo-overlay.tsx` - Spotlight overlay and tooltip UI
- `components/dashboard/demo-dashboard-wrapper.tsx` - Demo mode dashboard support
- `app/dashboard/layout.tsx` - Dashboard layout with theme provider
- `lib/demo-data.ts` - Sample data for demo walkthrough

#### Modified Files:
- `components/hero-section.tsx` - Added "Try Demo Mode" button
- `components/header.tsx` - Added theme control demo markers
- `components/dashboard/dashboard-client.tsx` - Added demo markers and demo mode badge
- `app/page.tsx` - Added section IDs for navigation
- `app/dashboard/page.tsx` - Added demo mode support
- `app/layout.tsx` - Wrapped with DemoModeProvider and DemoOverlay

### Component Structure

```
DemoModeProvider (Context)
├── App Content
└── DemoOverlay
    ├── Spotlight (Neon border around element)
    ├── Tooltip Card (Instructions + Navigation)
    └── Progress Indicator
```

### Demo Steps (15 Total)

| Step | Location | Element | Description |
|------|----------|---------|-------------|
| 1 | Landing | Hero Title | Welcome introduction |
| 2 | Landing | CTA Buttons | Call-to-action overview |
| 3 | Landing | Features Section | Feature showcase |
| 4 | Landing | Theme Controls | Theme customization |
| 5 | Landing | Intensity Slider | Glow effect control |
| 6 | Landing | Integrations | Integration options |
| 7 | Dashboard | Header | Dashboard overview |
| 8 | Dashboard | Integrations Tab | Connected services |
| 9 | Dashboard | GitHub Card | GitHub integration details |
| 10 | Dashboard | Hugging Face Card | HF integration details |
| 11 | Dashboard | Repositories Tab | Repository browser |
| 12 | Dashboard | Repository Grid | Sample repositories |
| 13 | Dashboard | Models Tab | AI models browser |
| 14 | Dashboard | Models Grid | Sample AI models |
| 15 | Dashboard | Extensions Tab | Extension marketplace |

## Styling

### Demo Mode Specific Styles

The demo system uses:
- **Neon borders** - Primary theme color with glow effect
- **Spotlight effect** - Rounded border matching theme
- **Dimmed overlay** - Semi-transparent dark background (opacity 0.7)
- **Tooltip card** - Dark background with neon accent border
- **Responsive positioning** - Auto-adjusts for mobile viewports

### Theme Support

Works seamlessly with all three theme variants:
- **Cyber** (Cyan/Teal)
- **Synth** (Orange/Pink) 
- **Hybrid** (Purple/Magenta)

Automatically adapts spotlight and tooltip colors to current theme.

## API Reference

### `useDemoMode()` Hook

```typescript
interface DemoModeContext {
  isDemoMode: boolean              // Current demo state
  currentStep: number              // Current step (0-indexed)
  startDemo: () => void            // Start demo walkthrough
  endDemo: () => void              // Exit demo mode
  nextStep: () => void             // Move to next step
  prevStep: () => void             // Move to previous step
  goToStep: (step: number) => void // Jump to specific step
  skipDemo: () => void             // Exit demo immediately
}
```

### `DemoOverlay` Component

Renders spotlight, tooltip, and navigation controls. Automatically:
- Finds elements with `data-demo` attributes
- Positions spotlight based on element bounds
- Shows/hides tooltip
- Handles navigation

### Sample Data

Located in `lib/demo-data.ts`:

```typescript
export const DEMO_REPOSITORIES = [...]  // GitHub repos
export const DEMO_MODELS = [...]        // HF models
export const DEMO_INTEGRATIONS = [...]  // Integration data
```

## User Experience Flow

```
Landing Page
    ↓
[Click "Try Demo Mode" Button]
    ↓
Demo Context Active (isDemoMode = true)
    ↓
Spotlight on Hero Title (Step 1/15)
    ↓
[User clicks Next or presses Right Arrow]
    ↓
Auto-scroll to next element
    ↓
Spotlight animates to new target
    ↓
[Repeat for 15 steps]
    ↓
Final step on Extensions Tab
    ↓
User can Exit Demo or navigate dashboard
```

## Mobile Considerations

- Tooltips adjust position to fit within viewport
- Spotlight adjusts size for smaller screens
- Touch-friendly button sizing
- Auto-scrolls elements into view
- Works on iOS Safari and Android browsers

## Accessibility

- Keyboard navigation (Arrow keys to navigate, Esc to exit)
- Screen reader support via semantic HTML
- High contrast spotlight for visibility
- Clear skip/exit options
- Progress indicators for orientation

## Performance

- Lightweight overlay (no heavy animations)
- CSS-based spotlight (GPU accelerated)
- Minimal DOM updates during transitions
- Efficient element querying via data attributes

## Future Enhancements

- [ ] Analytics tracking for demo completion rates
- [ ] Conditional steps based on user actions
- [ ] Auto-play mode with timed progression
- [ ] Demo customization per user segment
- [ ] Video/animation overlays for complex features
- [ ] Multi-language support for tooltips
- [ ] A/B testing different demo flows
- [ ] Integration with onboarding wizard

## Testing

The demo system has been tested with:
- Chrome, Firefox, Safari browsers
- Mobile viewports (375px - 1920px)
- All three theme variants
- Keyboard and mouse interaction
- Screen reader compatibility

## Troubleshooting

### Demo doesn't start
- Ensure `DemoModeProvider` is wrapping app in layout.tsx
- Check browser console for errors
- Verify `DemoOverlay` component is rendered

### Spotlight not highlighting element
- Verify element has `data-demo="element-name"` attribute
- Ensure element is visible in DOM before demo step reaches it
- Check z-index of overlay (should be very high: 9999+)

### Tooltip appears off-screen
- Overlay component has viewport boundary detection
- If still off-screen, check element positioning
- Ensure parent containers aren't hidden/overflow:hidden

## Resources

- Demo context: `contexts/demo-mode-context.tsx`
- Overlay component: `components/demo-overlay.tsx`
- Sample data: `lib/demo-data.ts`
- Landing page integration: `components/hero-section.tsx`
- Dashboard integration: `components/dashboard/dashboard-client.tsx`

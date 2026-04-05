# Project Guidelines

## Code Style

- TypeScript + React 18 with functional components and hooks
- Tailwind CSS v4 for styling, with custom theme variables in styles/theme.css
- Radix UI components for accessibility
- Formatting: Follow existing patterns in src/app/components/ for component structure

## Architecture

- Single-root state management in App.tsx with ProjectState and SlideData interfaces
- Component hierarchy: Header → TemplateSelector → (TemplateEditor ↔ TemplatePreview)
- 6 reusable templates (T01-T06) as pure functions receiving SlideData props
- Export pipeline handles OKLCH to RGB conversion and image loading for html2canvas

See src/app/App.tsx for state model and component boundaries.

## Build and Test

- Install: `npm install`
- Dev server: `npm run dev` (runs on port 5000)
- Build: `npm run build` → outputs to dist/
- Deploy: Vercel via vercel.json or Replit via replit.nix

## Conventions

- Image handling: Use crossOrigin="anonymous" for CORS-enabled backgrounds
- Color export: OKLCH colors are converted to RGB during export to avoid html2canvas issues
- Export timing: 300ms buffer for image/font loading; avoid changing without testing
- Port: Hardcoded to 5000 in vite.config.ts; edit if conflicts
- Responsive: Use clamp() for fluid typography, Tailwind breakpoints for layout

For detailed brand guidelines, see .agents/skills/versavisual-content/SKILL.md
For architecture and pitfalls, see guidelines/Guidelines.md and README.md
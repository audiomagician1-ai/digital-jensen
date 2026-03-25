# Digital Jensen

AI persona of Jensen Huang, distilled from public speeches, interviews, and keynotes.

## Stack
- React 19 + TypeScript + Vite 6
- Tailwind CSS 4 + Framer Motion
- Zustand 5 (state)
- OpenRouter API (default, any OpenAI-compatible API)

## Structure
- src/data/PERSONA.md — Core persona archive (6 dimensions)
- src/data/sources.json — Source material index
- src/lib/llm.ts — LLM API abstraction (streaming)
- src/lib/persona.ts — System prompt builder
- src/lib/store.ts — Zustand app state
- src/pages/ — Landing + Chat pages
- src/components/ — UI components

## Commands
- npm run dev — Dev server
- npm run build — Production build → dist/
- npm run lint — TypeScript check

## Deploy
Cloudflare Pages: npx wrangler pages deploy dist --project-name digital-jensen

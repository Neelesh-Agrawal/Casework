# Casework (Day 23)

A design-learning game built with **React** and **Vite**: scenarios, consequences, progress, and optional **Groq** or **Anthropic** API for the end-of-game portfolio case study.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env — add at least VITE_GROQ_API_KEY or VITE_ANTHROPIC_API_KEY for AI features
npm run dev
```

- **`npm run dev`** — local development  
- **`npm run build`** — production bundle  
- **`npm run lint`** — ESLint  

Secrets belong in **`.env`** (gitignored). Use **`.env.example`** as a template. Variables prefixed with `VITE_` are embedded in the client build; do not treat them as server-only secrets if you deploy publicly.

## Sharing the site publicly (API limits)

AI features (mentor feedback, case study generator) call **Groq or Anthropic from each visitor's browser** using your API key. If many people play at once, you will hit rate limits quickly — and anyone can extract the key from the built JavaScript.

**Recommended for demos you send to others:**

1. On your hosting platform (Vercel, Netlify, etc.), set environment variable:
   ```
   VITE_ENABLE_LLM=false
   ```
2. **Do not** set `VITE_GROQ_API_KEY` or `VITE_ANTHROPIC_API_KEY` in production — only in local `.env` for your own testing.
3. Redeploy.

The game is fully playable without AI. Players still get scenarios, consequences, lessons, and principles — only the optional end-of-game portfolio generator is skipped.

For a production app with many users, you would need a **backend proxy** that holds the API key server-side and rate-limits per user (not included in this project).

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

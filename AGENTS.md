<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio intro video

The site boots in three beats: CRT push-in clip → name letter intro → real UI (do not rely on the AI video to fake the website).

- **Component:** `src/components/LoadingScreen.tsx`
- **Asset path:** `public/intro/crt-enter.mp4` (required for the video intro)
- **Optional:** `public/intro/crt-enter.webm`
- If the file is missing, playback fails, or `prefers-reduced-motion` is on, skip the video and run the letter intro (reduced motion uses a short beat).
- Keep the clip short (**3–5s** ideal; current asset may be longer). End on a frame that matches the dark name intro — or a **full-frame dark / near-black glow** — so the crossfade into the letter screen looks clean.
- Screen must stay **perfectly centered and undistorted** in the generated video (no CRT warp/keystone), or the handoff breaks.
- Video→name handoff is an opaque cut near video end (`VIDEO_HANDOFF_LEAD_S` in `LoadingScreen.tsx`); the overlay only fades out after the name intro, when revealing the site.
- See `public/intro/README.md` for drop-in instructions.

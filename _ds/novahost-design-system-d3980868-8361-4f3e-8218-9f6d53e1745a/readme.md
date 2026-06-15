# NovaHost Design System

A production-ready design system for **NovaHost**, a (fictional) Vietnamese web-hosting brand. It is an **original recreation inspired by the Hostinger visual language** — royal purple on deep "meteorite" navy, DM Sans, friendly-but-professional tone — built so design agents can produce on-brand marketing pages, control-panel screens, auth flows, decks and emails.

> **Provenance & sources.** No codebase or Figma was provided. This system was authored from a written brief ("a design system similar to Hostinger's"). It deliberately **does not** reproduce Hostinger's trademarked logo, proprietary illustrations or copyrighted assets — the logo, components and screens here are original. Brand tokens (purple `#673DE6`, meteorite `#2F1C6A`, DM Sans) reflect the publicly recognisable hosting-SaaS aesthetic the brief asked for. Swap in real assets any time.

- **Language of sample content:** Vietnamese (vi)
- **Primary typeface:** DM Sans (Google Fonts) · **Mono:** DM Mono
- **Namespace (for cards):** `window.NovaHostDesignSystem_d39808`

---

## CONTENT FUNDAMENTALS

How NovaHost writes.

- **Voice:** Professional and concise (súc tích). Clear over clever. Lead with the benefit, then the proof.
- **Person:** Address the reader as **"bạn"** (you); the brand is **"chúng tôi"** (we) or simply "NovaHost". Warm but not overly casual.
- **Casing:** Sentence case everywhere — headings, buttons, labels. **No Title Case, no ALL CAPS** except tiny eyebrow/label tags (e.g. `BẢNG GIÁ`, `TÍNH NĂNG`) and badges (`PRO`).
- **Numbers:** Vietnamese formatting — comma for decimals, dot for thousands: `99,9%`, `₫49.000`, `0,4s`. Currency symbol `₫` precedes or follows the amount consistently (`₫588.000` / `49.000₫`).
- **CTAs:** Action verbs, short. "Bắt đầu ngay", "Chọn gói", "Tạo website", "Mở bảng điều khiển". Avoid "Click here".
- **Tone examples:**
  - Hero: *"Lưu trữ web siêu tốc cho mọi dự án"* — confident, benefit-first.
  - Sub: *"Khởi chạy website trong vài phút với hosting NVMe, SSL miễn phí và uptime 99,9%."*
  - Empty/disabled: factual, never cute.
- **Emoji:** Used **very sparingly** — a single 👋 in a dashboard greeting is the ceiling. Not in marketing headlines, buttons, or body copy. Iconography carries meaning, not emoji.
- **Reassurance pattern:** Pair claims with guarantees — "Hoàn tiền trong 30 ngày", "Hỗ trợ tiếng Việt 24/7", "không cần thẻ tín dụng".

---

## VISUAL FOUNDATIONS

- **Color.** Royal purple `#673DE6` (`--brand`) is the single hero color, used for primary buttons, links, active states and accents. Deep meteorite navy `#2F1C6A` (`--brand-ink` / `--text-heading`) is used for headings and dark surfaces; `#1E1147` for the darkest hero gradients. Neutrals are **slightly cool** (a hint of purple in the grays). Semantic colors: green `#18A957`, red `#E5402C`, amber `#F5A623`, blue `#2F7DF6` — always paired with a tinted subtle surface for backgrounds.
- **Type.** DM Sans throughout. Display/headings are **800 (extrabold)** with tight tracking (`-0.02 to -0.03em`); body is 400/500 at 16px, line-height 1.5–1.6. Mono is DM Mono for code, URLs and token names. Hero headlines run large (46–76px) and use `text-wrap: balance`.
- **Spacing.** 4px base grid (`--space-*`). Generous section rhythm (`84px` vertical on marketing). Container max ~1140px.
- **Backgrounds.** Two signatures: (1) the **meteorite hero gradient** — a radial navy-purple (`--gradient-hero`) — and (2) the **brand CTA gradient** (`--gradient-brand`, 135° violet→purple). Both are overlaid with a subtle **white dot-grid texture** (radial-gradient dots, 20–26px). Light sections use near-white (`--gray-50`) or a faint purple wash (`--gradient-soft`). **No photography is shipped** — surfaces are gradient + texture + UI mock; drop real imagery in later (keep it warm and bright if you do).
- **Corner radii.** Friendly and generous. Buttons `8px`, inputs `8px`, cards `16px`, pricing/large cards `24px`, CTA bands `32px`, pills/badges fully rounded. Avatars circular by default.
- **Cards.** White surface, `1px` cool border (`--border`), soft shadow `--shadow-sm`. Hover lifts `translateY(-3px)` to `--shadow-lg` and brightens the border to purple. An optional `accent` adds a `3px` purple top bar. Recommended/"popular" cards get a `2px` purple border + ribbon.
- **Shadows.** Cool, purple-tinted, soft and diffuse (never harsh black). Scale `xs → xl`; brand buttons get a colored `--shadow-brand` glow.
- **Borders.** `1px` for dividers/cards, `1.5px` for interactive controls (inputs, secondary buttons) so they read crisply.
- **Hover states.** Buttons darken one step (`--brand → --brand-hover`); ghost/secondary fill with `--purple-50`; links underline; nav items get a purple-50 wash. Icons shift to `--brand`.
- **Press states.** Buttons drop `translateY(1px) scale(0.99)`; icon buttons `scale(0.94)`. Quick (`120ms`).
- **Motion.** Purposeful, quick, no bounce on layout. `--dur-fast 120ms` / `--dur-base 200ms`, eased with `--ease-out`. A gentle spring (`--ease-spring`) is reserved for toggles, checkmarks and dialog pop. Dialogs fade the overlay + pop the panel. **No infinite decorative loops.**
- **Transparency & blur.** Used for glassy chrome: the marketing navbar and on-hero cards use `rgba(255,255,255,.10–.85)` + `backdrop-filter: blur`. Dialog overlay is `rgba(30,17,71,.45)` + blur.
- **Focus.** Visible 4px purple ring (`--ring`) on every interactive element — never removed.
- **Layout rules.** Marketing navbar is glassy and sits over the hero; control panel uses a fixed 248px sidebar rail + sticky 64px top bar. Content scrolls; chrome stays.

---

## ICONOGRAPHY

- **System:** **Lucide** (https://lucide.dev) — 24×24, `2px` stroke, round caps/joins. This is a **documented substitute** (no brand icon set was provided). A curated subset is implemented in `ui_kits/_shared/icons.js` (rocket, shield, globe, gauge, server, mail, lock, chart, database, settings, bell, etc.) and used across the UI kits. Match Lucide's weight/style if you add more, or pull live from the Lucide CDN.
- **Usage:** Line icons only, in `currentColor` so they inherit text/brand color. Feature icons sit in a `52px` purple-tint rounded tile (`--purple-50` bg, `--brand` icon). Inline status icons (check/cross) in pricing and alerts use the semantic colors.
- **Brand mark:** `assets/logo-mark.svg` — an original gradient-tile "N" monogram with a mint node. `assets/logo-mark-mono.svg` is a single-color (`currentColor`) variant. The **wordmark is set in live DM Sans text** (not baked into SVG): "Nova" in `--purple-900`, "Host" in `--purple-500` (or white/`--purple-300` on dark). See `guidelines/logo.html`.
- **Emoji as icons:** No. Unicode glyphs (✓, →, ✉, ☎) appear only inside the slide/email templates as lightweight ornaments, never in the component library.

---

## INDEX — what's in this system

**Foundations**
- `styles.css` — the single entry point consumers link. Import-only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `guidelines/` — specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab.
- `assets/` — `logo-mark.svg`, `logo-mark-mono.svg`.

**Components** (`components/`, namespace `NovaHostDesignSystem_d39808`)
- `buttons/` — **Button**, **IconButton**
- `forms/` — **Input**, **Textarea**, **Select**, **Checkbox**, **Radio**, **Switch**
- `data-display/` — **Card**, **Badge**, **Tag**, **Avatar**
- `pricing/` — **PricingCard**
- `navigation/` — **Navbar**, **Tabs**, **SidebarNav**
- `feedback/` — **Alert**, **Toast**, **Dialog**, **Tooltip**

**UI kits** (`ui_kits/`) — interactive, click-through recreations
- `marketing/` — homepage: hero, features, pricing toggle, testimonial, CTA, footer
- `dashboard/` — hPanel control panel: sidebar, stats, website list, settings
- `auth/` — login ⇄ register ⇄ onboarding split-screen flow
- `_shared/icons.js` — Lucide icon subset shared by the kits

**Templates** (`templates/`, Design Components — copy & edit)
- `slide-deck/SlideDeck.dc.html` — 6 branded 16:9 slide layouts
- `email/Email.dc.html` — transactional/welcome email, 600px

**Skill**
- `SKILL.md` — makes this folder usable as a Claude Agent Skill.

---

## Using it

Link the stylesheet and read components off the namespace:

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
<script>
  const { Button, PricingCard, Card } = window.NovaHostDesignSystem_d39808;
</script>
```

The three UI kits link to each other (marketing → auth → dashboard) so you can click through the whole product story.

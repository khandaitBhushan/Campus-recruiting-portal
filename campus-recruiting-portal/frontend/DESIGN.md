# Student Portal Design Direction

## 1. Visual Theme and Atmosphere
The student portal uses a warm editorial enterprise direction: calm ivory surfaces, deep navy structure, and restrained accent colors that feel premium without becoming decorative. The interface favors clarity over ornament, with obvious hierarchy and card treatments only where the content genuinely benefits from grouping.

## 2. Color Palette and Roles
- `canvas`: `oklch(0.97 0.01 85)` for the page background
- `panel`: `oklch(0.992 0.006 85)` for headers and main shells
- `raised`: `oklch(0.985 0.012 84)` for cards and form surfaces
- `line-soft`: `oklch(0.9 0.014 80)` for borders and separators
- `ink-900`: `oklch(0.25 0.03 255)` for primary text
- `ink-700`: `oklch(0.43 0.025 250)` for supporting text
- `navy-500`: `oklch(0.46 0.1 251)` for primary actions and navigation focus
- `navy-600`: `oklch(0.38 0.09 252)` for active states
- `moss-500`: `oklch(0.64 0.12 145)` for positive states
- `amber-500`: `oklch(0.76 0.14 78)` for pending and caution states
- `terracotta-500`: `oklch(0.62 0.16 32)` for attention and ineligible states

## 3. Typography Rules
- Font family: `"Familjen Grotesk", "Segoe UI", sans-serif`
- Display sizes: 36px to 44px, weight 700 to 800, letter-spacing `-0.022em`
- Section headings: 20px to 24px, weight 700, letter-spacing `-0.012em`
- Body text: 15px to 16px, weight 500 max, line-height `1.6`
- Numeric surfaces use `font-variant-numeric: tabular-nums`

## 4. Component Stylings
- Buttons use pill radii, minimum height 44px, navy primary fills, ivory secondary fills, and scale-to-press interactions
- Navigation uses a slim rail structure on desktop and pill chips on mobile
- Forms use soft raised surfaces with visible focus rings, never outlined-only placeholders
- Status badges are muted capsules with semantic color tints, never all-caps shouty labels

## 5. Layout Principles
- Desktop uses a sticky left workspace rail plus a roomy main content column
- Mobile collapses to stacked sections with a compact top navigation strip
- Spacing follows a 12/16/24/32 rhythm with larger 40px to 48px separation between major sections

## 6. Depth and Elevation
- Depth comes from warm background steps and layered shadows, not glass blur
- Shells sit on `panel`, cards sit on `raised`, and emphasis comes from stronger shadows rather than darker borders

## 7. Do's and Don'ts
- Do keep copy direct and student-task oriented
- Do make readiness, eligibility, and deadlines easy to scan
- Do keep motion subtle and purposeful
- Do not reintroduce glassmorphism or dark mode for this pass
- Do not stack identical cards when a cleaner list better matches the content

## 8. Responsive Behavior
- Breakpoints: 1080px for shell collapse, 720px for stacked actions and single-column content
- Touch targets remain at least 44px tall
- Sidebar navigation becomes a horizontal chip row on mobile

## 9. Agent Prompt Guide
- `canvas: oklch(0.97 0.01 85), panel: oklch(0.992 0.006 85), raised: oklch(0.985 0.012 84), navy-500: oklch(0.46 0.1 251), terracotta-500: oklch(0.62 0.16 32)`
- Example: "Create a student dashboard summary card on `raised`, heading 22px weight 700 with `-0.012em` tracking, supporting copy 15px on `ink-700`, and a navy primary CTA with pill radius"
- Example: "Create a job list row with metadata chips, tabular numeric compensation, warm ivory surface, and moss or terracotta eligibility signal"
- Example: "Create a profile form section with 24px padding, pill buttons, soft shadow, and visible navy focus rings on all inputs"

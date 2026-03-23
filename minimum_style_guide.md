# Design System Specification: The Architectural Minimalist

## 1. Overview & Creative North Star

**Creative North Star: The Silent Architect**
This design system rejects the "template-heavy" look of the modern web in favor of high-end editorial precision. It treats the browser window as a physical gallery space—where the luxury is found in the emptiness between elements, not the elements themselves.

The system is defined by **Strict Rectilinearity** (0px border radius) and **Asymmetric Tension**. We move away from centered, "safe" layouts. Instead, we use the wide typography scale to create intentional imbalances—placing massive `display-lg` headlines against tiny, utilitarian `label-sm` metadata. The goal is a digital experience that feels curated, quiet, and authoritative.

## 2. Colors

The palette is a sophisticated range of cool-toned neutrals, designed to mimic the interplay of light on architectural surfaces.

- **Foundation:** The core background is `surface` (`#f7f9fb`), but the "canvas" of primary content should often sit on `surface_container_lowest` (`#ffffff`) to provide that requested pure-white clarity.
- **The "No-Line" Rule:** While the prompt allows for subtle borders, as a rule, primary sectioning must be achieved through background shifts. Use `surface_container_low` (`#f0f4f7`) to define a sidebar or header against a `surface` body. Boundaries are felt, not seen.
- **Signature Textures:** For high-end CTAs, do not use flat fills. Use a subtle linear gradient from `primary` (`#5f5e5e`) to `primary_dim` (`#535252`) at a 155-degree angle. This adds a "brushed metal" depth that feels premium.
- **The "Glass" Exception:** For floating navigation or modal overlays, use `surface` with a 70% opacity and a `20px` backdrop-blur. This allows the structural grid to remain visible underneath, maintaining the sense of a singular, unified space.

## 3. Typography

We use **Inter** as a tool for structural hierarchy. The typography is the primary "graphic" element of the system.

- **The Contrast Principle:** High-end editorial design relies on extreme scale contrast. Pair `display-lg` (3.5rem) for hero statements directly with `body-sm` (0.75rem) for descriptions. This gap creates a "sophisticated silence."
- **Display & Headlines:** Use `display-lg` through `headline-sm` with a `-0.02em` letter-spacing. This "tights up" the character pairs, making the headings feel like a single, solid block of intent.
- **Labels:** `label-md` and `label-sm` should be used for all functional UI (buttons, tags, captions). They should be set in All-Caps with a `0.05em` letter-spacing to distinguish them from reading text.
- **Body:** `body-lg` (`#2a3439`) is our workhorse. Keep line-heights generous (1.6 or higher) to ensure the "whitespace" philosophy penetrates the text blocks themselves.

## 4. Elevation & Depth

In this system, depth is a matter of **Tonal Nesting**, not physical shadows.

- **The Layering Principle:**
  1.  Base: `surface` (`#f7f9fb`)
  2.  Secondary Level: `surface_container` (`#e8eff3`)
  3.  Interactive/Focus Level: `surface_container_lowest` (`#ffffff`)
      _Example:_ A data table sits on `surface_container`. The individual rows, when hovered, shift to `surface_container_lowest`.
- **Ambient Shadows:** If an element must float (e.g., a dropdown), use a "Shadow-as-Tone." Color: `on_surface` (`#2a3439`) at 4% opacity. Blur: 40px. Spread: 0px. Offset: 10px. This creates a soft atmospheric glow rather than a hard drop-shadow.
- **The "Ghost Border":** For inputs or containers requiring definition, use a `1px` border of `outline_variant` (`#a9b4b9`) but set it to **20% opacity**. It should be barely perceptible—a "whisper" of a line.
- **Edge Logic:** All corners are `0px`. No exceptions. This reinforces the architectural, engineered feel of the system.

## 5. Components

### Buttons

- **Primary:** Solid `primary` (`#5f5e5e`) fill, `on_primary` (`#faf7f6`) text. Sharp corners. Padding: `spacing-3` top/bottom, `spacing-6` left/right.
- **Secondary:** `1px` Ghost Border (`outline_variant` at 40% opacity). No fill. Text: `primary`.
- **Tertiary:** No border or fill. `label-md` style text with a `spacing-px` bottom-border that appears only on hover.

### Input Fields

- **Form Logic:** Never use 4-sided boxes. Use a single bottom border (`1px`) of `outline`. On focus, the border transitions to `primary` and thickens to `2px`.
- **Labels:** Always use `label-sm` positioned above the input, never placeholder text.

### Cards & Containers

- **The Grid Card:** Forbid divider lines. Use `spacing-8` to separate content blocks.
- **Selection:** Instead of a checkbox, use a background shift to `surface_container_highest` (`#d9e4ea`) to indicate a selected state.

### Navigation (The Editorial Rail)

- Use a slim vertical navigation bar on the left using `surface_container_low`. Use `label-sm` text rotated 90 degrees for a bespoke, high-end "magazine" feel.

## 6. Do's and Don'ts

### Do:

- **Embrace Asymmetry:** Align text to the left and leave the right 40% of the container empty.
- **Use the Spacing Scale:** Stick strictly to the increments. `spacing-16` (5.5rem) is your friend for separating major sections.
- **Color as Information:** Use `error` (`#9f403d`) only for critical failure. The system should otherwise remain monochrome and calm.

### Don't:

- **No Rounded Corners:** Never use `border-radius`. It breaks the architectural integrity of the system.
- **No Standard Shadows:** Avoid CSS `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`. It feels cheap. Use the Tonal Layering or Ambient Shadow rules defined in Section 4.
- **No Crowding:** If you feel you need a divider line, try adding `spacing-10` instead. Usually, more space is the better solution.
- **No Pure Black:** Use `on_background` (`#2a3439`) for text. It provides a softer, more premium legibility than `#000000`.

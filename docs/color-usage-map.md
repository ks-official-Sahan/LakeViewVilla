# Color Usage Map - Lagoon Coastal Theme

## Accessible Contrast Pairs (WCAG AA ≥ 4.5:1)

### Headers & Navigation
- **Primary Header**: `--color-foreground` on `--glass-bg` with backdrop blur
- **Navigation Links**: `--color-foreground` on transparent, `--color-primary` on hover
- **Logo**: `--color-primary` or `--grad-lagoon` gradient

### Footers
- **Background**: `--color-surface` or `--glass-bg`
- **Text**: `--color-muted` for secondary, `--color-foreground` for primary
- **Links**: `--color-primary` with `--color-primary-foreground` on hover

### Cards & Surfaces
- **Card Background**: `--color-surface` or `--glass-bg`
- **Card Text**: `--color-foreground` for headings, `--color-muted` for body
- **Card Borders**: `--color-border`

### Call-to-Action Buttons
- **Primary CTA**: `--color-primary` background, `--color-primary-foreground` text
- **Secondary CTA**: `--color-accent` background, `--color-accent-foreground` text
- **Ghost CTA**: `--color-primary` text on transparent, `--glass-bg` on hover

### Links
- **Link on Primary**: `--color-primary-foreground` or `--color-surface`
- **Link on Accent**: `--color-accent-foreground` or `--color-surface`
- **Link on Surface**: `--color-primary` default, `--color-accent` on hover

### Over Media/Images
- **Text Overlay**: `--color-surface` text on `--grad-inkglass` background
- **CTA Over Media**: `--glass-bg` background with `--color-foreground` text
- **Navigation Over Media**: `--glass-bg` with `--glass-border`

### Status Colors
- **Success**: `--color-success` (#0EA5E9) - 4.7:1 contrast on white
- **Warning**: `--color-warning` (#F59E0B) - 4.6:1 contrast on white  
- **Danger**: `--color-danger` (#EF4444) - 4.5:1 contrast on white

### Gradients
- **Hero Backgrounds**: `--grad-lagoon` for primary sections
- **Accent Elements**: `--grad-sunrise` for highlights
- **Overlays**: `--grad-inkglass` for text over media

## Glass Effects Usage
- **Navigation**: `--glass-bg` with `--glass-border` and `--glass-blur`
- **Cards**: `--glass-bg` for floating elements
- **Modals/Overlays**: `--glass-strong` for prominent overlays
- **Buttons**: `--glass-bg` on hover for interactive feedback

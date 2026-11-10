# Claude Skills — Baarns MannenKoor Website

Local Claude Skills for this project. Claude loads these automatically when working on relevant tasks.

## Available Skills

| Skill | Triggers on |
|---|---|
| `astro-design` | `.astro` components, scoped CSS, props, layouts, image handling |
| `responsive-css` | Grid/flex layouts, breakpoints, fluid typography, spacing |
| `web-accessibility` | ARIA, semantic HTML, focus, contrast, forms |
| `design-system` | Colors, typography, spacing tokens, component variants |

## Install in Claude Code

```bash
/plugin add .claude/skills/astro-design
/plugin add .claude/skills/responsive-css
/plugin add .claude/skills/web-accessibility
/plugin add .claude/skills/design-system
```

## Skill Structure

Each skill is a folder containing `SKILL.md` with YAML frontmatter:

```
skills/
├── astro-design/
│   └── SKILL.md
├── responsive-css/
│   └── SKILL.md
├── web-accessibility/
│   └── SKILL.md
└── design-system/
    └── SKILL.md
```

## Adding New Skills

1. Create folder: `.claude/skills/<skill-name>/`
2. Add `SKILL.md` with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: One-line description used for skill discovery
   ---
   ```
3. Write instructions — be specific, include code examples
4. Register in this file

## Absolute Veracity & Real-World Deliverable Proof (Never False Completion)
- **Zero False Completion**: NEVER claim a feature, integration, or system is done, verified, or working based solely on isolated unit tests or files written to disk if the actual user-facing application (e.g., OpenWebUI, database, deployed service) is not genuinely configured, populated, and verified in reality.
- **Admit Gaps Explicitly**: Admitting an integration gap or failure immediately is mandatory. If assets exist on disk but have not been imported or wired into the running application/UI, state the exact truth: *"The assets exist on disk, but [Application/UI] is not yet configured and cannot use them yet."*
- **End-User Experience is Ground Truth**: A task is only complete when the user can open the target application and immediately use the functionality as intended.

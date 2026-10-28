---
name: ui-skills-root
description: Use before UI-related work to select the smallest useful UI Skills context through the ui-skills CLI.
license: MIT
metadata:
  author: ibelick
  version: "1.0.0"
---

# UI Skills Root

You are the routing layer for UI Skills.

This skill is shown by `npx ui-skills start` and is also available in the registry.

Use it when an agent in Codex, Cursor, or Claude Code has a clear UI goal.

If the goal is unclear, ask one short question.

If the goal is clear, choose the right category, load the smallest useful skill context, then implement.

## Protocol

1. Decide if the task is UI-related.
2. If not, return `no skill needed`.
3. Identify the likely category.
4. Inspect that category with the CLI.
5. Select the smallest useful skill set.
6. Load only selected skill(s).
7. Implement using that context.

## CLI

```bash
npx ui-skills start
npx ui-skills categories
npx ui-skills list --category <category>
npx ui-skills get <slug>
```

## Selection Rules

- Prefer 1 skill.
- Use 2 only when the task needs two clear angles.
- Use 3 only for broad review, redesign, or multi-surface work.
- Never use more than 3.
- Route by topic, then stack, then specificity.
- Prefer specific skills over broad skills.
- Prefer framework-specific skills when the stack is obvious.
- For quick cleanup, prefer the most specific craft, visual, or layout skill available.
- If unsure, inspect categories and pick the safest narrow skill.

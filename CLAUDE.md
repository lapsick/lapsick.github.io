# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is a **GitHub Spec Kit** project scaffolded for **Spec-Driven Development (SDD)**. There is **no application code yet** — only the `.specify/` tooling and the `.claude/skills/speckit-*` commands that drive the SDD workflow. The eventual product is a "portfolio" (the directory name); its stack, structure, and constitution are still to be defined through the workflow below.

Do not invent an application architecture. Real product structure appears only after a feature is specified and planned. When starting real work, run the workflow rather than hand-creating `specs/` or source directories.

Key facts (from `.specify/init-options.json` / `.specify/integration.json`):
- Integration: `claude`; command invoke separator is `-`, so skills are called as `/speckit-specify`, `/speckit-plan`, etc.
- Scripts: PowerShell (`ps`) under `.specify/scripts/powershell/`. There are no bash equivalents installed here.
- Feature numbering: `sequential` (e.g. `001-`, `002-`).
- This directory is **not a git repository**. Feature "branches" are directory names under `specs/`, not real git branches — feature state is tracked in files, not by git (see below).

## The SDD workflow

Features flow through this pipeline, each stage a skill invoked as a slash command.

1. `/speckit-constitution` — fill in `.specify/memory/constitution.md` (currently an unfilled template). Establishes project-wide principles that later stages must honor.
2. `/speckit-specify "<description>"` — creates `specs/NNN-<short-name>/spec.md` from the spec template. This is the entry point for any new feature.
3. `/speckit-clarify` — (optional) asks up to 5 targeted questions and writes answers back into the spec.
4. `/speckit-plan` — generates `plan.md` and design docs (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`) in the feature directory.
5. `/speckit-tasks` — generates a dependency-ordered `tasks.md`.
6. `/speckit-analyze` — (optional) non-destructive consistency check across spec/plan/tasks.
7. `/speckit-implement` — executes `tasks.md`.

Support skills: `/speckit-checklist` (custom quality checklists), `/speckit-converge` (reconcile codebase against spec/plan/tasks, appending remaining work to `tasks.md`), `/speckit-taskstoissues` (export tasks as GitHub issues).

Each skill's `SKILL.md` in `.claude/skills/` begins by running a PowerShell script (below) to resolve paths and prerequisites, then acts on the returned JSON. Follow the SKILL.md rather than reimplementing its steps.

## Feature state (important, non-obvious)

Because there are no git branches, the "current feature" is resolved by the scripts in this priority order (see `common.ps1` → `Get-FeaturePathsEnv`):
1. `$env:SPECIFY_FEATURE_DIRECTORY` (explicit override), or `$env:SPECIFY_FEATURE`
2. `.specify/feature.json` (the persisted `feature_directory`, written by `/speckit-specify`)
3. Otherwise the scripts error out asking you to run specify first.

`create-new-feature.ps1` sets those env vars for its own session and persists `feature.json`. In a **fresh** Claude session the env vars are gone, so path-resolving scripts rely on `feature.json`. To operate on a specific existing feature without re-running specify, set `$env:SPECIFY_FEATURE_DIRECTORY` (e.g. `specs/001-foo`) before invoking a skill.

## Scripts (invoke via `pwsh`, not bash)

All live in `.specify/scripts/powershell/`. They print human text by default and machine JSON with `-Json`; the skills call them with `-Json`.

```powershell
# Create a feature dir + spec.md and set feature state
.specify/scripts/powershell/create-new-feature.ps1 -Json "Add a projects gallery"
.specify/scripts/powershell/create-new-feature.ps1 -Json -ShortName 'proj-gallery' "Add a projects gallery"

# Resolve feature paths only (no side effects / no validation)
.specify/scripts/powershell/check-prerequisites.ps1 -PathsOnly

# Gate for the plan phase (requires plan.md); add -RequireTasks -IncludeTasks for implement phase
.specify/scripts/powershell/check-prerequisites.ps1 -Json
.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks

.specify/scripts/powershell/setup-plan.ps1 -Json    # copy plan template into the feature dir
.specify/scripts/powershell/setup-tasks.ps1 -Json   # resolve tasks template + available docs
```

Any script accepts `-Help`. There is no build/lint/test tooling in the repo yet — that gets introduced by the first feature's plan.

## Repo-root resolution

Scripts locate the project by walking upward for the `.specify/` directory (`Find-SpecifyRoot` in `common.ps1`), **not** for `.git`. `$env:SPECIFY_INIT_DIR` can override this for CI/monorepo use. Keep `.specify/` at the intended project root.

## Templates and the override stack

Stage output is generated from templates in `.specify/templates/` (`spec-template.md`, `plan-template.md`, `tasks-template.md`, `checklist-template.md`, `constitution-template.md`). Template resolution (`Resolve-Template` / `Resolve-TemplateContent` in `common.ps1`) checks, in priority order: `templates/overrides/` → `.specify/presets/` → `.specify/extensions/` → core `templates/`. To customize generated specs/plans/tasks project-wide, add an override at `.specify/templates/overrides/<name>.md` rather than editing the core template. Preset composition (prepend/append/wrap strategies) requires Python 3 + PyYAML.

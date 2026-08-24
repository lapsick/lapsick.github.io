<!--
SYNC IMPACT REPORT
Version change: none (unfilled template) → 1.0.0
Bump rationale: Initial ratification. The prior file was the unmodified scaffold with no
  adopted content, so this is a first adoption rather than an amendment.

Principles defined (all new):
  - I. Node.js Backend (NON-NEGOTIABLE)
  - II. No Database (NON-NEGOTIABLE)
  - III. No Automated Tests (NON-NEGOTIABLE)
  - IV. Static by Default
  - V. Simplicity Over Capability

Sections added:
  - Technology Constraints (template slot SECTION_2)
  - Development Workflow (template slot SECTION_3)
  - Governance

Sections removed: none.

Deferred items: none. RATIFICATION_DATE set to today, this being the adoption date.

Consistency note: Principles II and IV align with specs/001-portfolio-blog-site/spec.md
  (file-based blog authoring, contact messages not persisted). Principle III removes the
  automated-verification gate that spec's SC-001..SC-012 would otherwise be checked by;
  see Development Workflow for the manual verification requirement that replaces it.
-->

# Portfolio Constitution

## Core Principles

### I. Node.js Backend (NON-NEGOTIABLE)

All server-side code MUST run on Node.js. Any build tooling, site generation, and the contact-form
handler MUST be Node.js-based. Runtimes other than Node.js (Deno, Bun, Python, .NET, PHP, Go) MUST
NOT be introduced for server-side or build-time work.

Rationale: A single runtime keeps the toolchain, dependency management, and deployment story
uniform for a solo-maintained project.

### II. No Database (NON-NEGOTIABLE)

No database of any kind — relational, document, key-value, embedded, or hosted. All content MUST
live in files in the repository. Runtime state MUST NOT be persisted by the application.

Rationale: The site's content is authored and deployed as files, and contact messages are delivered
to email rather than stored. A database would add operational burden, cost, and backup obligations
that no requirement justifies.

### III. No Automated Tests (NON-NEGOTIABLE)

No unit, integration, contract, or end-to-end test suites. No test framework, test runner, or
testing dependency MUST be added, and no task MUST be written that produces tests.

Rationale: Explicit owner decision for a small personal site. Verification happens by the manual
checks defined in Development Workflow. Accepted trade-off: regressions are caught by human review
and manual checking rather than by CI, so changes must be kept small and legible.

### IV. Static by Default

Every page MUST be generated at build time and served as a static asset. Server-side execution at
request time is permitted ONLY for the contact-form submission endpoint. Adding any further runtime
endpoint requires a documented amendment to this constitution.

Rationale: The specification calls for a static site with exactly one dynamic action. Constraining
runtime surface keeps hosting cheap, the site fast, and the attack surface near zero.

### V. Simplicity Over Capability

Choose the smallest solution that satisfies the requirement. Every runtime dependency MUST be
justified by a specific requirement. Do not build for anticipated future needs, additional content
types, or extensibility that no current requirement asks for.

Rationale: Solo-maintained projects fail from accumulated complexity, not from missing features.

## Technology Constraints

- **Runtime**: Node.js (active LTS or newer). Server-side JavaScript/TypeScript only.
- **Persistence**: Filesystem only. Content is committed to the repository.
- **Blog content**: Plain-text files edited locally; published by deploying. The live site MUST NOT
  expose any authoring, administrative, or login interface.
- **Contact form**: Submissions are delivered by email to the owner's configured address and are
  NOT persisted by the application.
- **Secrets**: Email credentials and any API keys MUST be supplied via environment variables and
  MUST NOT be committed to the repository.
- **Dependencies**: Prefer the platform and the standard library. Each added package MUST be
  traceable to a requirement.

## Development Workflow

- Work proceeds through the Spec Kit pipeline: specify → plan → tasks → implement.
- Because Principle III forbids test suites, every user story MUST be verified manually against its
  acceptance scenarios in the specification before that story is considered complete, and the
  outcome recorded. Unverified work MUST NOT be reported as done.
- Every change MUST be previewed locally before deployment.
- A deployment MUST leave the previously deployed site intact if it fails.
- Changes MUST be kept small enough to review by reading.

## Governance

This constitution supersedes other practices and conventions for this project. Where a plan, task,
or implementation conflicts with a principle here, the constitution wins and the conflicting work
MUST be revised.

**Amendments**: Any change to a principle MUST be made by editing this file, with a rationale and a
version bump recorded in the Sync Impact Report at the top. Amending a NON-NEGOTIABLE principle
requires the deviation and its justification to be stated explicitly in the amendment.

**Versioning**: Semantic versioning. MAJOR for removing or redefining a principle in a
backward-incompatible way; MINOR for adding a principle or materially expanding guidance; PATCH for
clarifications and wording.

**Compliance**: Every plan and every review MUST confirm the work honors all five principles.
Complexity that appears to violate Principle V MUST be justified in writing or removed.

**Version**: 1.0.0 | **Ratified**: 2026-08-24 | **Last Amended**: 2026-08-24

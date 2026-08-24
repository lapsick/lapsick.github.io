# Feature Specification: Personal Portfolio Site with Blog

**Feature Branch**: `001-portfolio-blog-site`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "Create simple portfolio site for me as Software Engineer and Architect with personal blog. Content should be placed from my linked in page. There should also be links to my github and also contact page with form. So more pages will be static except contact form and blog. I want to have mechanism to post blog-posts. All contacts from contact page should be sent to my email. I expect contacts from recruiters. UI/UX should be modern"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recruiter evaluates the owner's background (Priority: P1)

A technical recruiter lands on the site from a search result, a LinkedIn link, or an email signature. Within seconds they need to understand who the site owner is, what they do (Software Engineer and Architect), the seniority and shape of their experience, and the technologies they work with. They scan a landing page that leads with a clear headline and summary, then move to an experience/about page carrying the professional history sourced from the owner's LinkedIn profile: roles, companies, dates, responsibilities, achievements, skills, education, and certifications. They can jump to the owner's GitHub profile to see code.

**Why this priority**: This is the site's core purpose. If a visitor cannot quickly understand the owner's professional profile, nothing else on the site matters. This story alone — landing page plus experience content plus GitHub link — is a viable MVP.

**Independent Test**: Publish only the landing and experience/about pages with GitHub links. A person unfamiliar with the owner can, without help, state the owner's current role, list at least three technologies they work with, summarize their career trajectory, and open their GitHub profile.

**Acceptance Scenarios**:

1. **Given** a visitor arrives at the site root, **When** the landing page loads, **Then** they see the owner's name, professional title (Software Engineer and Architect), a short positioning summary, and visible navigation to experience/about, blog, and contact.
2. **Given** a visitor is on the experience/about page, **When** they read it, **Then** they find the professional history sourced from LinkedIn — roles with company names and date ranges, responsibilities and achievements, skills, and education/certifications.
3. **Given** a visitor wants to see the owner's code, **When** they activate the GitHub link, **Then** the owner's GitHub profile opens in a new browsing context and the site page remains open behind it.
4. **Given** a visitor opens the site on a phone, **When** any page renders, **Then** all content is readable and navigable without horizontal scrolling or zooming.
5. **Given** a visitor uses only a keyboard, **When** they tab through a page, **Then** every interactive element is reachable, activatable, and shows a visible focus indicator.

---

### User Story 2 - Recruiter makes contact (Priority: P1)

A recruiter who is convinced by the profile wants to reach the owner about a role. They open the contact page, fill in a short form (their name, email, optionally company, and a message), submit it, and immediately see confirmation that the message was sent. The owner receives the message in their email inbox and can reply directly to the sender from their mail client.

**Why this priority**: Contact is the site's conversion action. A portfolio that presents well but loses inbound recruiter interest fails at its business goal. It is tied P1 with Story 1 because the two together form the minimum useful product.

**Independent Test**: With only the contact page live, a tester submits the form and confirms (a) an on-screen success confirmation appears, (b) the owner's inbox receives an email containing every submitted field, and (c) replying to that email addresses the sender.

**Acceptance Scenarios**:

1. **Given** a visitor is on the contact page, **When** they submit the form with all required fields valid, **Then** the message is delivered to the owner's email address and the visitor sees a clear success confirmation on the page.
2. **Given** a visitor submits the form with a missing required field or a malformed email address, **When** they attempt submission, **Then** submission is blocked and each invalid field is identified with a specific, human-readable message, and the visitor's already-entered input is preserved.
3. **Given** the owner opens a contact email, **When** they press reply, **Then** the reply is addressed to the sender's submitted email address, and the email body contains the sender's name, email, company (if given), message, and the submission timestamp.
4. **Given** message delivery fails for any reason, **When** the visitor submits, **Then** they see an explicit failure notice with an alternative way to reach the owner (a direct email address), and their entered content is not lost.
5. **Given** an automated bot submits the form, **When** the submission is processed, **Then** it is rejected or quarantined without the owner's inbox receiving it, and no legitimate human submission is blocked in the process.
6. **Given** a visitor submits the form repeatedly in quick succession, **When** they exceed a reasonable submission rate, **Then** further submissions are refused with an explanatory message.

---

### User Story 3 - Owner publishes a blog post (Priority: P2)

The owner writes a technical article — an architecture pattern, a lessons-learned piece, a tool review. Working on their own machine in their usual editor, they compose the post as a plain-text file with formatted body (headings, lists, links, inline code, code blocks, images) plus a title, summary, publication date, and tags. They preview the whole site locally to see the post exactly as visitors will, then deploy. The post becomes visible on the public blog index and at its own permanent URL. The owner can later edit or unpublish it by changing the file and deploying again.

**Why this priority**: The blog demonstrates depth of thinking and keeps the site fresh, which strengthens the recruiter impression. But it is not required for the site to fulfil its primary purpose, so it follows the two P1 stories.

**Independent Test**: The owner authors a post file, previews it locally, and deploys. From a separate browser with no owner privileges, they confirm the post appears on the blog index and renders correctly at its own URL with all formatting intact.

**Acceptance Scenarios**:

1. **Given** the owner has composed a post file with title, summary, body, date, and tags, **When** they deploy the site, **Then** the post appears on the public blog index and is reachable at its own stable, human-readable URL.
2. **Given** the owner is composing or editing a post, **When** they preview the site locally, **Then** they see the post rendered exactly as visitors will see it after deployment, before it becomes public.
3. **Given** a post file is marked as a draft, **When** the site is deployed and an ordinary visitor browses the site or requests the post's URL directly, **Then** the draft is neither listed nor reachable, and no draft content is present in what was deployed.
4. **Given** the owner edits or unpublishes a published post and deploys, **When** the deployment completes, **Then** the public site reflects the change, and an unpublished post's URL no longer serves the content.
5. **Given** a post body contains headings, lists, links, inline code, fenced code blocks, and images, **When** a visitor reads the post, **Then** all of that formatting renders correctly, code blocks are syntax-highlighted and horizontally scrollable rather than overflowing the page, and images scale to the viewport.
6. **Given** the deployed site is reachable over the public internet, **When** anyone probes it for a way to create, edit, or delete content, **Then** no such interface exists to be found — the live site offers no authoring, administrative, or login surface at all.
7. **Given** the owner adds a new post and deploys, **When** the deployment completes, **Then** the blog index, the relevant tag listings, the subscription feed, and the sitemap all include the new post without the owner having edited any of them by hand.

---

### User Story 4 - Visitor browses and finds blog content (Priority: P3)

A visitor interested in the owner's writing opens the blog index, sees posts listed newest first with title, date, summary, and tags, and opens one. From a post they can return to the index, browse other posts by the same tag, and share the post — the shared link renders a proper title, summary, and preview image on social platforms and in messaging apps.

**Why this priority**: Discovery and shareability amplify the blog's reach, but they only have value once posts exist (Story 3). Deferring this does not block publishing.

**Independent Test**: With several posts published, a visitor can locate a specific post by browsing the index and by filtering on a tag, and pasting a post URL into a social/messaging preview tool shows the correct title, summary, and image.

**Acceptance Scenarios**:

1. **Given** posts have been published, **When** a visitor opens the blog index, **Then** posts are listed newest first, each showing title, publication date, summary, and tags.
2. **Given** a visitor selects a tag, **When** the filtered view loads, **Then** only posts carrying that tag are listed.
3. **Given** a visitor shares a post link on a social or messaging platform, **When** the platform generates a preview, **Then** the preview shows the post's title, summary, and a representative image.
4. **Given** the blog index contains many posts, **When** the visitor reaches the end of the listed posts, **Then** they can reach older posts through a clear continuation mechanism.
5. **Given** a visitor requests a blog URL that does not exist, **When** the page loads, **Then** they see a helpful not-found page offering navigation back to the blog index and the landing page.

---

### Edge Cases

- A visitor requests any non-existent URL on the site: a branded not-found page appears with navigation back to the main sections, rather than a raw server error.
- The email delivery service is unavailable or rejects the message when the contact form is submitted: the visitor is told delivery failed and given the owner's direct email address; the submission content is not silently discarded.
- A contact message contains an extremely long body, script-like content, or non-Latin characters: the site accepts or rejects it against a stated length limit, delivers non-Latin text intact, and the resulting email cannot execute or render injected markup.
- A contact submission's reply-to address is forged or non-existent: the owner still receives the message and can see the address is unverified; delivery to the owner is never blocked by the sender address being unreachable.
- The blog has zero published posts: the blog index shows a purposeful empty state rather than a blank or broken page.
- A blog post is published with a title that duplicates an existing post: the two posts still resolve to distinct, stable URLs and neither overwrites the other.
- A post file is malformed or missing a required field (no title, no date, unparseable formatting): the problem is surfaced to the owner before or during deployment with the offending file named, rather than producing a broken page on the live site.
- A deployment fails partway: the previously deployed site remains intact and serving, rather than being left partially replaced.
- The owner renames a published post's URL slug: the old URL is either preserved or redirected, so links already shared by readers do not break (SC-011).
- An owner-published post references an image that is missing or fails to load: the post body still renders and remains readable.
- A visitor loads the site on a slow mobile connection: the primary content of a page is readable before secondary assets finish loading.
- A visitor has scripting disabled or blocked: the static content pages (landing, about/experience, blog posts) remain readable, and the contact page still surfaces a usable way to reach the owner.
- A visitor uses a screen reader: page structure, headings, form labels, error messages, and link purposes are announced meaningfully.
- A visitor prefers a dark colour scheme at the operating-system level: the site presents a legible palette in that scheme.
- The owner's LinkedIn profile changes after launch: site content becomes stale until refreshed; the site does not silently display contradictory data, and there is a defined way to update it.

## Requirements *(mandatory)*

### Functional Requirements

#### Site structure and content

- **FR-001**: The site MUST provide a landing page presenting the owner's name, professional title (Software Engineer and Architect), a positioning summary, and entry points to the experience/about, blog, and contact sections.
- **FR-002**: The site MUST provide an experience/about page containing the owner's professional history sourced from their LinkedIn profile: roles with employer names and date ranges, responsibilities and achievements, skills, and education/certifications.
- **FR-003**: The site MUST present links to the owner's GitHub profile from at least the landing page and the experience/about page, opening in a new browsing context.
- **FR-004**: The site MUST present a link to the owner's LinkedIn profile alongside the GitHub link.
- **FR-005**: The site MUST provide persistent navigation to every top-level section from every page.
- **FR-006**: All pages other than the contact form and the blog MUST be static content that requires no visitor-supplied input to render.
- **FR-007**: The site MUST serve a branded not-found page for unrecognized URLs, offering navigation back to the landing page and blog index.
- **FR-008**: The site MUST provide a way for a visitor to obtain the owner's résumé/CV content, either as a page or a downloadable document.

#### Contact

- **FR-009**: The site MUST provide a contact page with a form collecting, at minimum, the sender's name, the sender's email address, and a message; company/organization MUST be offered as an optional field.
- **FR-010**: The system MUST validate that required fields are present and that the email address is well-formed before accepting a submission, identifying each invalid field individually with a human-readable message.
- **FR-011**: On successful submission, the system MUST deliver the message content to the owner's configured email address.
- **FR-012**: The delivered email MUST contain every submitted field plus the submission timestamp, and MUST be composed so that the owner's reply action addresses the sender's submitted email address.
- **FR-013**: The system MUST display an unambiguous on-screen confirmation to the visitor when a submission has been accepted for delivery.
- **FR-014**: On delivery failure, the system MUST inform the visitor that delivery failed, present the owner's direct email address as an alternative, and preserve the visitor's entered content.
- **FR-015**: The system MUST reject automated/bot submissions without requiring a legitimate human visitor to solve a disruptive challenge in the normal case.
- **FR-016**: The system MUST limit the rate of submissions from a single source and refuse excess submissions with an explanatory message.
- **FR-017**: The system MUST neutralize submitted content so that it cannot execute or inject markup when the owner views the resulting email.
- **FR-018**: The system MUST enforce and communicate a maximum length for the message field.
- **FR-019**: The contact page MUST state how the sender's data will be used and that it is sent to the owner by email.

#### Blog

- **FR-020**: The owner MUST be able to create a blog post with a title, summary, publication date, tags, and a formatted body supporting headings, lists, links, inline code, fenced code blocks, and images.
- **FR-021**: Post authoring MUST take place in files the owner edits on their own machine with their existing editor, using a plain-text formatting syntax that remains readable and editable without any special tool.
- **FR-022**: Publishing a post MUST be accomplished by deploying the site; the running site MUST NOT expose any interface through which content can be created, edited, or deleted.
- **FR-023**: The owner MUST be able to preview a post exactly as visitors will see it, on their own machine, before it is deployed.
- **FR-024**: The owner MUST be able to publish, edit, unpublish, and delete posts through the same authoring-and-deploy workflow, with no step requiring a login to the live site.
- **FR-025**: The system MUST keep posts marked as drafts out of the deployed site entirely, so that no draft is reachable by any visitor, including via a guessed or previously known direct URL.
- **FR-026**: Adding, changing, or removing a post MUST NOT require editing any other post, and MUST NOT require the owner to hand-maintain the blog index, tag listings, feed, or sitemap — these MUST be derived from the posts themselves at deploy time.
- **FR-027**: Each published post MUST be reachable at a stable, human-readable, permanent URL that does not change when unrelated posts are added or removed.
- **FR-028**: The system MUST render fenced code blocks with syntax highlighting and confine them to a horizontally scrollable region rather than allowing the page to scroll horizontally.
- **FR-029**: The blog index MUST list published posts newest first, each with title, publication date, summary, and tags, and MUST provide a means to reach older posts beyond the first page.
- **FR-030**: Visitors MUST be able to view the set of posts carrying a given tag.
- **FR-031**: The blog index MUST show a purposeful empty state when no posts are published.
- **FR-032**: Each post MUST expose metadata sufficient for social and messaging platforms to render a link preview containing the post's title, summary, and a representative image.
- **FR-033**: The site MUST publish a machine-readable feed of published posts so readers can subscribe.

#### Presentation, accessibility, and discoverability

- **FR-034**: Every page MUST render legibly and remain fully navigable on viewport widths from small phones to large desktops, without horizontal page scrolling.
- **FR-035**: Every interactive element MUST be reachable and operable by keyboard alone, with a visible focus indicator.
- **FR-036**: Text and interactive elements MUST meet WCAG 2.1 Level AA contrast requirements in every colour scheme the site offers.
- **FR-037**: The site MUST adapt to the visitor's operating-system light/dark colour scheme preference.
- **FR-038**: The site MUST respect a visitor's reduced-motion preference by suppressing non-essential animation.
- **FR-039**: Static content pages MUST remain readable when scripting is unavailable, and the contact page MUST still surface a usable way to reach the owner in that case.
- **FR-040**: Every page MUST carry a descriptive title and summary for search engines, and the site MUST expose a sitemap of its public pages.
- **FR-041**: All non-decorative images MUST carry meaningful alternative text.

### Key Entities

- **Profile**: The owner's professional identity, sourced from LinkedIn. Attributes: name, professional title, positioning summary, contact email, profile photo, GitHub URL, LinkedIn URL, list of skills.
- **Experience Entry**: One role in the owner's career. Attributes: employer, role title, start date, end date (or "present"), location, responsibilities and achievements, technologies used. Belongs to the Profile, ordered by recency.
- **Education / Certification Entry**: One qualification. Attributes: institution or issuer, qualification name, date or date range. Belongs to the Profile.
- **Blog Post**: One published or draft article. Attributes: title, URL slug, summary, body content, publication date, last-updated date, tags, cover/preview image, publication state (draft or published).
- **Tag**: A topic label grouping posts. Attributes: display name, URL slug. Many-to-many with Blog Post.
- **Contact Message**: One submission from the contact form. Attributes: sender name, sender email, sender company (optional), message body, submission timestamp, delivery outcome. Transient — its destination is the owner's inbox rather than long-term site storage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor who has never heard of the owner can state the owner's professional title and name at least three of their core technologies within 30 seconds of the landing page appearing.
- **SC-002**: A recruiter can go from arriving at the site to submitting a contact message in under 2 minutes, in no more than 3 page transitions.
- **SC-003**: 100% of valid contact submissions arrive in the owner's inbox within 5 minutes of submission, and every one of them can be replied to directly from the owner's mail client.
- **SC-004**: Over any 30-day period, no more than 1 unwanted automated message per week reaches the owner's inbox from the contact form, while zero legitimate submissions are rejected.
- **SC-005**: The owner can take a finished draft from "ready to publish" to "publicly visible at its own URL" in under 10 minutes, unaided, from their own machine.
- **SC-006**: The deployed site exposes zero authoring, administrative, or login endpoints — verified by confirming no such route responds and that no content-modifying request from any visitor can succeed.
- **SC-007**: Any page's primary content becomes readable within 3 seconds on a mid-range mobile device over a typical 4G connection.
- **SC-008**: Every public page passes automated WCAG 2.1 Level AA accessibility checks with zero violations, and every interactive element is operable by keyboard alone.
- **SC-009**: Every page renders without layout breakage or horizontal page scrolling at viewport widths of 320px, 768px, 1280px, and 1920px, in both light and dark colour schemes.
- **SC-010**: Every published blog post URL, when shared on a major social or messaging platform, produces a preview showing the correct title, summary, and image.
- **SC-011**: 100% of published post URLs remain valid and resolve to the same content after subsequent posts are published, edited, or removed.
- **SC-012**: Search engines can index every public page, evidenced by all public URLs appearing in the site's sitemap and none being blocked from crawling.

## Assumptions

- **Single owner, no accounts anywhere**: The site has exactly one author (the owner). Nobody authenticates against the live site — not visitors, and not the owner. Comments, reactions, and any other visitor-generated content on blog posts are out of scope for this feature.
- **Blog authoring is local-then-deploy (decided 2026-08-24)**: The owner writes posts as plain-text files on their own machine using their existing editor, previews the site locally, and publishes by deploying. Chosen over a hosted admin interface. Consequences accepted: no owner login, no post database, and no administrative surface to secure — the entire live site is static apart from the contact form; and the owner can only publish from a machine with their authoring setup, not from a phone or borrowed computer.
- **Owner has developer tooling and is comfortable with it**: SC-005's 10-minute publish target assumes the owner already has their editor and a working deploy path on the machine they write from. First-time setup on a new machine is excluded from that measurement.
- **LinkedIn content is transferred manually**: Profile, experience, education, and skills content is copied from the owner's LinkedIn profile as a one-time authoring step and stored as site content. No live or automated integration with LinkedIn is assumed — LinkedIn does not offer general programmatic profile access for this purpose. Keeping the site in sync with later LinkedIn edits is a manual content update. The owner must supply the actual LinkedIn profile content before the site can be completed.
- **GitHub presence is link-only**: The GitHub presence is represented by links to the owner's profile and selected repositories. Live rendering of repository data, contribution graphs, or star counts is out of scope for this feature.
- **Owner's destination email is pre-configured**: The inbox that receives contact messages is configured by the owner during setup and is not visitor-selectable.
- **Contact messages are not stored long-term on the site**: Email delivery to the owner is the system of record. Any retained copy exists only to support delivery-failure handling and is not exposed as a site feature.
- **English only**: The site is authored and presented in a single language; internationalization and translation are out of scope.
- **Public content only**: All site content is public. There is no gated, subscriber-only, or paywalled content.
- **Analytics out of scope**: Visitor analytics were not requested and are excluded from this feature; if added later they must remain consistent with the privacy statement on the contact page.
- **Modest traffic**: The site is expected to serve personal-portfolio traffic volumes (hundreds to low thousands of visits per month), not high-concurrency load.
- **Recruiters are the primary audience**: Content emphasis, contact flow, and résumé access are optimized for recruiters and hiring managers; engineers reading the blog are the secondary audience.
- **"Modern UI/UX" is interpreted as**: a clean, uncluttered, typography-led visual design; responsive from phone to desktop; light and dark colour schemes; accessible to WCAG 2.1 AA; fast-loading; and restrained, purposeful motion that respects reduced-motion preferences. These are captured as testable requirements (FR-034 through FR-041) rather than left as subjective styling.

# Contract: `POST /api/contact`

**Feature**: 001-portfolio-blog-site | **Date**: 2026-08-24

One of the two routes making up the contact flow — the only part of the deployed site that runs at
request time (Constitution IV, SC-006). Implemented at `src/pages/api/contact.ts` with `export const
prerender = false`. The other is `GET /contact` itself, also server-rendered so it can read the
one-time flash cookie this handler sets on a no-JavaScript error/failure redirect (see
[plan.md](../plan.md#summary)). Every other route on the site is static.

---

## Request

**Method**: `POST` · **Path**: `/api/contact`

**Content types accepted** — both, because FR-039 requires the form to work without scripting:

| Type | When |
|---|---|
| `application/x-www-form-urlencoded` | Native form POST, no JavaScript |
| `application/json` | Enhanced fetch submission |

Any other content type ⇒ `415`.

**Body fields** (validation rules in [data-model.md](../data-model.md#contact-submission)):

| Field | Type | Required | Constraint |
|---|---|---|---|
| `name` | string | yes | 1–100 chars, trimmed |
| `email` | string | yes | Well-formed, ≤254 chars |
| `company` | string | no | ≤100 chars |
| `message` | string | yes | 1–5000 chars |
| `_hp` | string | no | Honeypot — must be absent or empty |
| `_t` | number | yes | Form render time, epoch ms |

**All validation is re-performed server-side.** Client-side checks are a convenience and are never
trusted.

---

## Responses

### `200 OK` — accepted and sent (FR-013)

```json
{ "ok": true, "message": "Thanks — your message has been sent." }
```

For a no-JavaScript form POST, respond instead with `303 See Other` to `/contact?sent=1`, which
renders the same confirmation. This prevents a resubmit-on-refresh.

### `400 Bad Request` — validation failed (FR-010)

Every invalid field is reported in one response, not just the first.

```json
{
  "ok": false,
  "errors": {
    "email": "Enter a valid email address.",
    "message": "Message must be 5000 characters or fewer."
  }
}
```

No-JavaScript equivalent: re-render `/contact` with the errors shown inline **and the visitor's
input preserved** (FR-010).

### `415 Unsupported Media Type`

```json
{ "ok": false, "message": "Unsupported content type." }
```

### `429 Too Many Requests` — rate limited (FR-016)

```json
{ "ok": false, "message": "Too many messages sent. Please try again later." }
```

Includes a `Retry-After` header in seconds.

### `502 Bad Gateway` — delivery failed (FR-014)

```json
{
  "ok": false,
  "message": "We couldn't send your message. Please email owner@example.com directly.",
  "fallbackEmail": "owner@example.com"
}
```

The visitor's entered content MUST be preserved in the form so nothing is lost.

### Silent rejection — spam (FR-015)

A filled honeypot or a submission faster than 3s after render returns **`200 OK` with the normal
success body** and sends no email. Bots are not told they were detected. This is the one case where
the response deliberately does not reflect what happened; it is the standard honeypot pattern and is
required for the technique to work.

---

## Behaviour sequence

1. Reject non-`POST` with `405`; reject unsupported content type with `415`.
2. Parse body by content type.
3. Honeypot and timing check → on failure, return fake success, send nothing.
4. Rate-limit check on client IP → on failure, `429`.
5. Validate all fields, collecting every error → on failure, `400` with the full error map.
6. Strip CR/LF from `name` and `email` (header-injection defence, FR-017).
7. Compose and send the plain-text email (below).
8. Success ⇒ `200`/`303`. SMTP failure ⇒ `502` with the fallback address.

**Never logged**: the message body and the sender's email address. Delivery failures log the SMTP
error only. Constitution II — nothing is persisted.

---

## Outbound email contract (FR-011, FR-012)

| Header | Value |
|---|---|
| `From` | `"Portfolio Contact" <noreply@owner-domain>` — a mailbox on the **owner's** domain |
| `Reply-To` | The visitor's submitted email — this is what makes reply-to-sender work (FR-012) |
| `To` | `CONTACT_TO_EMAIL` |
| `Subject` | `Portfolio contact: {name}{ – company if given}` |

Body is **`text/plain` only** (FR-017 — no HTML part, so injected markup cannot render):

```text
Name:      {name}
Email:     {email}
Company:   {company or "—"}
Submitted: {ISO 8601 timestamp}

{message}
```

> **Critical**: `From` MUST NOT be the visitor's address. Spoofing the sender fails DMARC and sends
> legitimate recruiter mail to spam, breaking SC-003. See [research.md](../research.md#r3-email-delivery).

---

## Configuration

Environment variables only; never committed (Constitution — Technology Constraints).

| Variable | Purpose |
|---|---|
| `SMTP_HOST`, `SMTP_PORT` | SMTP server |
| `SMTP_USER`, `SMTP_PASS` | SMTP credentials |
| `SMTP_FROM` | `From` address on the owner's domain |
| `CONTACT_TO_EMAIL` | Destination inbox |
| `PUBLIC_FALLBACK_EMAIL` | Address shown to the visitor on `502` |

The endpoint MUST fail loudly at startup if any required variable is missing, rather than silently
accepting submissions it cannot deliver.

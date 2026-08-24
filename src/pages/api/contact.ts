import type { APIRoute } from 'astro';
import { validateContact } from '../../lib/validate';
import { checkRateLimit } from '../../lib/ratelimit';
import { sendContactMessage } from '../../lib/mail';

// The only non-prerendered route in the project (Constitution IV).
export const prerender = false;

const FALLBACK_EMAIL = process.env.PUBLIC_FALLBACK_EMAIL ?? '';
const MIN_SUBMIT_MS = 3000; // bots submit near-instantly
const FLASH_COOKIE = 'contact_flash';

interface FlashPayload {
  values?: { name?: string; email?: string; company?: string; message?: string };
  errors?: Record<string, string>;
  submitFailed?: boolean;
}

function json(body: unknown, status: number, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function setFlashAndRedirect(cookies: import('astro').AstroCookies, payload: FlashPayload) {
  cookies.set(FLASH_COOKIE, JSON.stringify(payload), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60,
  });
  return new Response(null, { status: 303, headers: { Location: '/contact' } });
}

export const POST: APIRoute = async ({ request, clientAddress, cookies }) => {
  if (request.method !== 'POST') {
    return json({ ok: false, message: 'Method not allowed.' }, 405);
  }

  const contentType = request.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const isFormEncoded = contentType.includes('application/x-www-form-urlencoded');

  if (!isJson && !isFormEncoded) {
    return json({ ok: false, message: 'Unsupported content type.' }, 415);
  }

  let raw: Record<string, unknown>;
  try {
    if (isJson) {
      raw = await request.json();
    } else {
      const formData = await request.formData();
      raw = Object.fromEntries(formData.entries());
    }
  } catch {
    return json({ ok: false, message: 'Could not read submission.' }, 400);
  }

  const values = {
    name: typeof raw.name === 'string' ? raw.name : '',
    email: typeof raw.email === 'string' ? raw.email : '',
    company: typeof raw.company === 'string' ? raw.company : '',
    message: typeof raw.message === 'string' ? raw.message : '',
  };

  // --- Spam defence: honeypot + timing (FR-015) ---
  // A filled honeypot or a too-fast submission gets the same "success" response
  // a legitimate visitor sees; no email is sent. Bots are never told they were caught.
  const honeypotFilled = typeof raw._hp === 'string' && raw._hp.trim() !== '';
  const renderedAt = Number(raw._t);
  const tooFast = Number.isFinite(renderedAt) && Date.now() - renderedAt < MIN_SUBMIT_MS;

  if (honeypotFilled || tooFast) {
    if (isJson) {
      return json({ ok: true, message: 'Thanks — your message has been sent.' }, 200);
    }
    return new Response(null, { status: 303, headers: { Location: '/contact?sent=1' } });
  }

  // --- Rate limit (FR-016) ---
  const rateLimitKey = clientAddress ?? 'unknown';
  const rateLimit = checkRateLimit(rateLimitKey);
  if (!rateLimit.allowed) {
    const message = 'Too many messages sent. Please try again later.';
    const headers = { 'Retry-After': String(rateLimit.retryAfterSeconds) };
    if (isJson) {
      return json({ ok: false, message }, 429, headers);
    }
    return setFlashAndRedirect(cookies, { values, submitFailed: true });
  }

  // --- Validation (FR-010, FR-018) ---
  const result = validateContact(values);
  if (!result.ok) {
    if (isJson) {
      return json({ ok: false, errors: result.errors }, 400);
    }
    return setFlashAndRedirect(cookies, { values, errors: result.errors });
  }

  // --- Delivery (FR-011, FR-012, FR-017) ---
  try {
    await sendContactMessage({ ...result.value, submittedAt: new Date() });
  } catch (err) {
    // Never log the message body or sender address — only that delivery failed.
    console.error('Contact form delivery failed:', err instanceof Error ? err.message : err);
    if (isJson) {
      return json(
        {
          ok: false,
          message: `We couldn't send your message. Please email ${FALLBACK_EMAIL} directly.`,
          fallbackEmail: FALLBACK_EMAIL,
        },
        502,
      );
    }
    return setFlashAndRedirect(cookies, { values, submitFailed: true });
  }

  if (isJson) {
    return json({ ok: true, message: 'Thanks — your message has been sent.' }, 200);
  }
  return new Response(null, { status: 303, headers: { Location: '/contact?sent=1' } });
};

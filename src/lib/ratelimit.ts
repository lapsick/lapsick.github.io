// In-memory only — never persisted to disk. Per Constitution II, this is
// ephemeral process state, not a database. Counters reset on restart and are
// per-process; see specs/001-portfolio-blog-site/research.md (R4) for the
// accepted trade-offs at this traffic scale.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;
const SWEEP_INTERVAL = 200; // sweep expired entries every N calls

interface Counter {
  count: number;
  windowStart: number;
}

const counters = new Map<string, Counter>();
let callsSinceSweep = 0;

function sweep(now: number) {
  for (const [key, counter] of counters) {
    if (now - counter.windowStart >= WINDOW_MS) {
      counters.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  callsSinceSweep += 1;
  if (callsSinceSweep >= SWEEP_INTERVAL) {
    callsSinceSweep = 0;
    sweep(now);
  }

  const existing = counters.get(key);

  if (!existing || now - existing.windowStart >= WINDOW_MS) {
    counters.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((existing.windowStart + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

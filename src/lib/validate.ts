export interface ContactFields {
  name: string;
  email: string;
  company: string;
  message: string;
}

export type ValidationErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: {
  name: unknown;
  email: unknown;
  company: unknown;
  message: unknown;
}): { ok: true; value: ContactFields } | { ok: false; errors: ValidationErrors } {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const company = typeof input.company === 'string' ? input.company.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';

  const errors: ValidationErrors = {};

  if (!name) {
    errors.name = 'Please enter your name.';
  } else if (name.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (email.length > 254 || !EMAIL_RE.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (company.length > 100) {
    errors.company = 'Company must be 100 characters or fewer.';
  }

  if (!message) {
    errors.message = 'Please enter a message.';
  } else if (message.length > 5000) {
    errors.message = 'Message must be 5000 characters or fewer.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: { name, email, company, message } };
}

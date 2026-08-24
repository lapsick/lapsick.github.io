import nodemailer from 'nodemailer';

export interface ContactMessage {
  name: string;
  email: string;
  company: string;
  message: string;
  submittedAt: Date;
}

const REQUIRED_VARS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'CONTACT_TO_EMAIL',
] as const;

function readConfig() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // Fail loudly rather than silently accepting submissions we cannot deliver.
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }

  return {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    from: process.env.SMTP_FROM!,
    to: process.env.CONTACT_TO_EMAIL!,
  };
}

let transporter: nodemailer.Transporter | undefined;
let config: ReturnType<typeof readConfig> | undefined;

function getTransporter() {
  if (!transporter) {
    config = readConfig();
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return transporter;
}

// Header-injection defence: strip CR/LF before any value reaches a header field.
function stripHeaderInjection(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export async function sendContactMessage(input: ContactMessage): Promise<void> {
  const activeTransporter = getTransporter();
  const cfg = config!;

  const safeName = stripHeaderInjection(input.name);
  const safeEmail = stripHeaderInjection(input.email);
  const subjectSuffix = input.company ? ` – ${stripHeaderInjection(input.company)}` : '';

  const body = [
    `Name:      ${safeName}`,
    `Email:     ${safeEmail}`,
    `Company:   ${input.company || '—'}`,
    `Submitted: ${input.submittedAt.toISOString()}`,
    '',
    input.message,
  ].join('\n');

  await activeTransporter.sendMail({
    from: cfg.from,
    to: cfg.to,
    replyTo: safeEmail,
    subject: `Portfolio contact: ${safeName}${subjectSuffix}`,
    text: body,
  });
}

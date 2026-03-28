function sanitizePhoneNumber(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

export function buildEmailHref(email: string): string | null {
  const trimmed = email.trim();
  return trimmed ? `mailto:${trimmed}` : null;
}

export function buildPhoneHref(phone: string): string | null {
  const sanitized = sanitizePhoneNumber(phone.trim());
  return sanitized ? `tel:${sanitized}` : null;
}

export function buildUrlHref(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  return `https://${trimmed}`;
}

export function isExternalHref(href: string): boolean {
  return /^https?:/i.test(href);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

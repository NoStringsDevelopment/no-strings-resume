import React from 'react';
import { buildEmailHref, buildPhoneHref, buildUrlHref, isExternalHref } from '@/utils/linkUtils';

type ResumeInlineLinkKind = 'email' | 'phone' | 'url';

interface ResumeInlineLinkProps {
  value?: string;
  kind?: ResumeInlineLinkKind;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

function resolveHref(kind: ResumeInlineLinkKind, value?: string): string | null {
  if (!value) {
    return null;
  }

  if (kind === 'email') {
    return buildEmailHref(value);
  }

  if (kind === 'phone') {
    return buildPhoneHref(value);
  }

  return buildUrlHref(value);
}

export function ResumeInlineLink({
  value,
  kind = 'url',
  children,
  className,
  style,
  testId,
}: ResumeInlineLinkProps) {
  const href = resolveHref(kind, value);

  if (!href) {
    return (
      <span className={className} style={style} data-testid={testId}>
        {children}
      </span>
    );
  }

  const external = isExternalHref(href);

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={className}
      style={style}
      data-testid={testId}
    >
      {children}
    </a>
  );
}

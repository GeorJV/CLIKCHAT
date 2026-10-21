import React from 'react';

export const BRAND_MARK_BODY = 'M4 5c2 8 5 14.5 7.8 14.7 2.3.2 3.7-4.1 4.7-8.2';
export const BRAND_MARK_TAIL = 'M16.5 11.5c.8-3 2-5.5 4-6.1';
export const BRAND_CYAN = '#00c6f5';

export function VoceroBrandMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d={BRAND_MARK_BODY}
        stroke="currentColor"
        strokeWidth={3.4}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={BRAND_MARK_TAIL}
        stroke={BRAND_CYAN}
        strokeWidth={3.4}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function VoceroBrandLogo({ kicker = 'CRM · WhatsApp' }: { kicker?: string }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-[#0d5bff] to-[#00c6f5] text-white shadow-sm font-black text-xs font-mono">
        CK
      </div>
      <div className="min-w-0">
        <span className="block text-[15px] font-extrabold tracking-tight text-white leading-none">
          CLIKCHAT
        </span>
        <span className="vocero-kicker mt-1 block leading-none">
          {kicker}
        </span>
      </div>
    </div>
  );
}

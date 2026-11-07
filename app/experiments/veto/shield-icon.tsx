import type { SVGProps } from "react";

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="m12 2 8 3v6c0 5-4 8-8 11-4-3-8-6-8-11V5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="m8 11 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

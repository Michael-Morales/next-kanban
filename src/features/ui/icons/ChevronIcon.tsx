import { SVGProps } from "react";

export function ChevronIcon({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width="10"
      height="7"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke="#635FC7" strokeWidth="2" fill="none" d="m1 1 4 4 4-4" />
    </svg>
  );
}

interface SlotMachineIconProps {
  className?: string;
  size?: number;
}

export function SlotMachineIcon({ className = '', size = 48 }: SlotMachineIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Machine body */}
      <rect x="6" y="14" width="36" height="26" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      {/* Top bar */}
      <rect x="12" y="8" width="24" height="8" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
      {/* Reel 1 */}
      <circle cx="17" cy="27" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="17" y="30" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif">7</text>
      {/* Reel 2 */}
      <circle cx="28" cy="27" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="28" y="30" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif">7</text>
      {/* Reel 3 */}
      <circle cx="39" cy="27" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="39" y="30" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif">7</text>
      {/* Lever */}
      <path d="M42 18C46 18 46 26 42 26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="16" r="2.5" fill="currentColor" />
    </svg>
  );
}

interface TicketIconProps {
  className?: string;
  size?: number;
}

export function TicketIcon({ className = '', size = 20 }: TicketIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 8V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V8C21 8.55228 20.5523 9 20 9H19C17.8954 9 17 9.89543 17 11V13C17 14.1046 17.8954 15 19 15H20C20.5523 15 21 15.4477 21 16V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V16C3 15.4477 3.44772 15 4 15H5C6.10457 15 7 14.1046 7 13V11C7 9.89543 6.10457 9 5 9H4C3.44772 9 3 8.55228 3 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
    </svg>
  );
}

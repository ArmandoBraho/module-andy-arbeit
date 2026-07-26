type IconProps = {
  className?: string
  size?: number
}

export function PhoneIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.5 4h3l1.5 5-2 1.2a11 11 0 0 0 5.8 5.8L16 14l5 1.5v3a1.5 1.5 0 0 1-1.6 1.5C9.6 20 4 14.4 4 5.6A1.5 1.5 0 0 1 5.5 4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}


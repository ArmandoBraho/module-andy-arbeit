type NotfallIconProps = {
  className?: string
  size?: number
}

export function NotfallIcon({ className, size = 18 }: NotfallIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2.5c.45 0 .86.24 1.09.63l9.2 16.2c.23.4.22.9-.02 1.29A1.25 1.25 0 0 1 21.2 21H2.8c-.45 0-.86-.24-1.07-.68a1.25 1.25 0 0 1-.02-1.29l9.2-16.2A1.25 1.25 0 0 1 12 2.5zm0 5.25c-.55 0-1 .4-1 .9v5.1c0 .5.45.9 1 .9s1-.4 1-.9v-5.1c0-.5-.45-.9-1-.9zm0 9.25a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3z"
      />
    </svg>
  )
}

import type { ReactNode } from 'react'

type ServiceIconProps = {
  serviceId: string
  className?: string
  size?: number
}

type IconProps = {
  className?: string
  size: number
}

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  'aria-hidden': true as const,
  focusable: false as const,
}

function PipeIcon({ className, size }: IconProps) {
  return (
    <svg className={className} width={size} height={size} {...svgProps}>
      <path
        d="M4 9.5h7.5a2.5 2.5 0 0 1 2.5 2.5v0a2.5 2.5 0 0 1-2.5 2.5H10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14.5h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4 9.5V7.2A1.2 1.2 0 0 1 5.2 6h1.6A1.2 1.2 0 0 1 8 7.2V9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14.5v2.3A1.2 1.2 0 0 0 11.2 18h1.6a1.2 1.2 0 0 0 1.2-1.2v-2.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18.5" cy="14.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function RenovationIcon({ className, size }: IconProps) {
  return (
    <svg className={className} width={size} height={size} {...svgProps}>
      <path
        d="M4.5 19.5h15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.5 19.5V10.8L12 6.5l5.5 4.3v8.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 19.5v-4.2h4v4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8 8.2l1.9-1.9a1.2 1.2 0 0 1 1.7 1.7l-1.9 1.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HouseIcon({ className, size }: IconProps) {
  return (
    <svg className={className} width={size} height={size} {...svgProps}>
      <path
        d="M4.5 11.2 12 5.5l7.5 5.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.8V19h11V10.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 19v-4.5h4V19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GardenIcon({ className, size }: IconProps) {
  return (
    <svg className={className} width={size} height={size} {...svgProps}>
      <path
        d="M12 20.5V11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 13.5c-2.8 0-5-1.9-5-4.6C7 6.2 9.2 4.5 12 4.5c2.8 0 5 1.7 5 4.4 0 2.7-2.2 4.6-5 4.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 10.2c-1.7.4-3.2-.4-3.7-1.8-.6-1.7.4-3.4 2.2-3.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15.8 10.2c1.7.4 3.2-.4 3.7-1.8.6-1.7-.4-3.4-2.2-3.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CleaningIcon({ className, size }: IconProps) {
  return (
    <svg className={className} width={size} height={size} {...svgProps}>
      <path
        d="M8.5 20.5h7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 20.5V10.8c0-1.4.7-2.7 1.9-3.5L14 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 5.5c1.3 0 2.4 1.1 2.4 2.5S15.3 10.5 14 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6.2 8.2 5 7M7.5 5.8 7 4.5M18.8 9.5l1.2-.8M17.2 6.2l.6-1.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

const iconsByServiceId: Record<string, (props: IconProps) => ReactNode> = {
  abwassertechnik: PipeIcon,
  komplettsanierung: RenovationIcon,
  hausmeisterservice: HouseIcon,
  'garten-landschaftspflege': GardenIcon,
  gebaeudereinigung: CleaningIcon,
}

export function ServiceIcon({ serviceId, className, size = 22 }: ServiceIconProps) {
  const Icon = iconsByServiceId[serviceId]
  if (!Icon) return null
  return <Icon className={className} size={size} />
}

export function hasServiceIcon(serviceId: string): boolean {
  return Boolean(iconsByServiceId[serviceId])
}

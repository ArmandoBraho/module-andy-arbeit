import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'white'

type BaseProps = {
  variant?: ButtonVariant
  block?: boolean
  children: ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never; to?: never }

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: never }

type ButtonAsRouterLink = BaseProps & {
  to: string
  href?: never
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsRouterLink

export function Button({
  variant = 'primary',
  block = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, block ? 'btn--block' : '', className]
    .filter(Boolean)
    .join(' ')

  if ('to' in props && props.to) {
    const { to, ...linkProps } = props
    return (
      <Link to={to} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props
    return (
      <a href={href} className={classes} {...linkProps}>
        {children}
      </a>
    )
  }

  const { type = 'button', ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  )
}

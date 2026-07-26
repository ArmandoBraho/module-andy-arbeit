import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { pageMeta, site } from '../../data/content'

const DEFAULT_META = pageMeta['/']
const JSON_LD_ID = 'local-business-jsonld'

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function absoluteUrl(pathname: string) {
  const path = pathname === '/' ? '' : pathname
  return `${site.url}${path}`
}

function ensureLocalBusinessJsonLd() {
  let script = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.id = JSON_LD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/logoAndyVonLogoDesign.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.streetAddress,
      postalCode: site.address.postalCode,
      addressLocality: site.address.addressLocality,
      addressCountry: site.address.addressCountry,
    },
    areaServed: {
      '@type': 'City',
      name: 'München',
    },
  })
}

/** Updates document title, description, Open Graph tags, and LocalBusiness JSON-LD. */
export function DocumentMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    ensureLocalBusinessJsonLd()
  }, [])

  useEffect(() => {
    const meta = pageMeta[pathname] ?? DEFAULT_META
    const url = absoluteUrl(pathname)

    document.title = meta.title
    upsertMeta('name', 'description', meta.description)

    upsertMeta('property', 'og:title', meta.title)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:locale', 'de_DE')
    upsertMeta('property', 'og:site_name', site.name)
    upsertMeta('property', 'og:image', `${site.url}/logoAndyVonLogoDesign.png`)

    upsertLink('canonical', url)
  }, [pathname])

  return null
}

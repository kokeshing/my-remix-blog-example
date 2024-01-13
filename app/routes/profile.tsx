import type { MetaFunction } from '@remix-run/cloudflare'

export const meta: MetaFunction = () => {
  return [
    { title: 'Profile - EXAMPLE' },
    { name: 'description', content: 'プロフィール' },
    { property: 'og:title', content: 'Profile - EXAMPLE' },
    { propetry: 'og:type', content: 'website' },
    { property: 'og:image', content: '[ogp_image_url]' },
    { property: 'og:url', content: '/profile/' },
    { property: 'og:description', content: 'プロフィール' },
    { propetry: 'og:site_name', content: 'EXAMPLE' },
    { name: 'twitter:title', content: 'Profile - EXAMPLE' },
    { name: 'twitter:image', content: '[ogp_image_url]' },
    { name: 'twitter:url', content: '/profile/' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:description', content: 'プロフィール' },
    { name: 'twitter:site', content: '[your_twitter_account]' },
    { tagName: 'link', rel: 'canonical', href: '/profile/' },
  ]
}

export default function Profile() {
  return (
    <div className="mx-auto w-11/12 tracking-tight md:w-full md:max-w-screen-sm">
      <h1 className="text-lg font-bold text-blue-600">Name</h1>
      <p>Your Name</p>
    </div>
  )
}

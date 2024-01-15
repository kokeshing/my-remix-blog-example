import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { cssBundleHref } from '@remix-run/css-bundle'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useLocation,
} from '@remix-run/react'
import { SSRProvider } from 'next-ssr'
import { useEffect } from 'react'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import globalStyles from '~/global.css'
import tailwindStyles from '~/tailwind.css'
import * as gtag from '~/utils/gtags.client'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStyles },
  { rel: 'stylesheet', href: globalStyles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const gaTrackingId = context.env.GA_TRACKING_ID ?? ''
  return json({ gaTrackingId })
}

export default function App() {
  const { gaTrackingId } = useLoaderData<typeof loader>()
  const location = useLocation()

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId)
    }
  }, [location, gaTrackingId])

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {!gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}
        <Header />
        <SSRProvider>
          <Outlet />
        </SSRProvider>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

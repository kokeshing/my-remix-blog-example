/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare'
import { RemixServer } from '@remix-run/react'
import isbot from 'isbot'
import { renderToReadableStream } from 'react-dom/server'

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  const url = new URL(request.url)
  const cacheKey = new Request(url.toString(), request)
  const cache = caches.default
  const cachedResponse = await cache.match(cacheKey)
  if (cachedResponse) {
    // cachedResponseはimmutableなので、headerを変更するために新しいResponseを作成する
    return new Response(cachedResponse.body, {
      // キャッシュからのレスポンスかを確認するためのヘッダー（無くても良い）
      headers: { ...cachedResponse.headers, 'Custom-Cached-Response': 'true' },
      status: cachedResponse.status,
    })
  }

  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error)
        responseStatusCode = 500
      },
    },
  )

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady
  }

  responseHeaders.set('Content-Type', 'text/html')
  if (url.pathname === '/') {
    // 記事一覧のページは30分キャッシュを保持
    responseHeaders.set('Cache-Control', 'public, maxage=1800')
  } else {
    // 他は1日キャッシュを保持
    responseHeaders.set('Cache-Control', 'public, maxage=86400')
  }
  // キャッシュからのレスポンスかを確認するためのヘッダー（無くても良い）
  responseHeaders.set('Custom-Cached-Response', 'false')
  const response = new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  })

  // remix.env.d.tsで渡したEventContextを取り出して使う
  loadContext.ctx.waitUntil(cache.put(cacheKey, response.clone()))

  return response
}

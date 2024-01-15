import type { LoaderFunctionArgs } from '@remix-run/cloudflare'

export async function loader({ context, params }: LoaderFunctionArgs) {
  const { key, ext } = params

  const contentType =
    ext === '.jpg' || ext === '.jpeg'
      ? 'image/jpeg'
      : ext === '.png'
        ? 'image/png'
        : ext === '.flac'
          ? 'audio/flac'
          : ext === '.wav'
            ? 'audio/wav'
            : undefined
  if (contentType == null) {
    return new Response('Not Found', { status: 404 })
  }

  const body =
    context.env.R2 == null
      ? null
      : await context.env.R2.get(`${key?.replace(':', '/')}${ext}`)
  if (body == null) {
    return new Response('Not Found', { status: 404 })
  }
  const blob = await body.blob()

  return new Response(blob, {
    status: 200,
    headers: {
      'Content-Type': contentType,
    },
  })
}

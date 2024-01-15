import { Element } from 'domhandler'
import { filter } from 'domutils'
import * as htmlparser2 from 'htmlparser2'
import { useSSR } from 'next-ssr'

interface OGPData {
  title?: string
  description?: string
  image?: string
}

export function LinkCard({ href }: { href: string }) {
  const { data } = useSSR<OGPData>(
    () =>
      fetch(href, {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
      })
        .then((r) => r.text())
        .then((text) => {
          const dom = htmlparser2.parseDocument(text)
          const meta = filter(
            (elem) =>
              elem.type === htmlparser2.ElementType.Tag && elem.name === 'meta',
            dom,
          ) as Element[]
          const ogp = meta.reduce((prev, m) => {
            const property = m.attribs.property
            const content = m.attribs.content

            if (property === 'og:title') {
              return { ...prev, title: content }
            }
            if (property === 'og:description') {
              return { ...prev, description: content }
            }
            if (property === 'og:image') {
              return { ...prev, image: content }
            }

            return prev
          }, {} as OGPData)

          return ogp
        }),
    { key: href },
  )

  return data ? (
    <div className="my-4 h-32 w-full overflow-hidden rounded-lg border border-gray-300 hover:bg-blue-100">
      <a className="no-underline" href={href}>
        <div className="flex h-full w-full items-center justify-between">
          <div
            className={`${
              data.image ? 'max-w-2/3 min-w-1/2' : 'w-full'
            } h-24 p-2`}
          >
            {data.description ? (
              <>
                <p className="line-clamp-1 text-sm font-bold text-black md:text-base">
                  {data.title ?? href}
                </p>
                <p className="mt-2 line-clamp-1 text-xs text-black">
                  {data.description}
                </p>
                <p className="mt-3 text-xs text-blue-600">
                  {new URL(href).hostname}
                </p>
              </>
            ) : (
              <>
                <p className="line-clamp-1 text-sm font-bold text-black md:text-base">
                  {data.title ?? href}
                </p>
                <p className="mt-3 text-xs text-blue-600">
                  {new URL(href).hostname}
                </p>
              </>
            )}
          </div>
          {data.image && (
            <img
              className="max-w-1/2 m-0 block h-auto max-h-full w-auto"
              alt="ogp画像"
              src={data.image}
            />
          )}
        </div>
      </a>
    </div>
  ) : (
    <div></div>
  )
}

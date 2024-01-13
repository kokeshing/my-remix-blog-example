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
    <div className="w-112 my-4 h-32 overflow-hidden rounded-lg border border-gray-300 hover:bg-blue-100">
      <a className="no-underline" href={href}>
        <div className="flex h-full w-full items-center justify-between">
          <div className={`${data.image ? 'w-80' : 'w-96'} h-24 p-2`}>
            {data.description ? (
              <>
                <p className="overflow-hidden whitespace-nowrap font-bold text-black">
                  {data.title ?? href}
                </p>
                <p className="mt-2 overflow-hidden text-xs text-black">
                  {data.description.substring(0, 120)}
                </p>
              </>
            ) : (
              <p className="overflow-hidden whitespace-nowrap font-bold text-black">
                {data.title ?? href}
              </p>
            )}
          </div>
          {data.image && (
            <img
              className="m-0 block h-auto max-h-full w-auto max-w-full"
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

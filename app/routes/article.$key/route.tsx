import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { ArticleHeading } from '~/components/article-heading'
import { Article } from '~/types/article'
import { Env } from '~/types/env'
import { ArticleBody } from './article-body'

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const env = context.env as Env
  const result =
    env.DB == null
      ? null
      : await env.DB.prepare(`SELECT * FROM articles WHERE key = ?`)
          .bind(params.key)
          .first<Article>()

  return json({
    article: result,
  })
}

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
    integrity:
      'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
    crossOrigin: 'anonymous',
  },
]

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `${data?.article?.title} - EXAMPLE`
  const key = data?.article?.key ?? ''
  return [
    { title: title },
    { name: 'description', content: `${data?.article?.title}` },
    { property: 'og:title', content: title },
    { propetry: 'og:type', content: 'website' },
    { property: 'og:image', content: '[ogp_image_url]' },
    { property: 'og:url', content: `/article/${key}` },
    { property: 'og:description', content: `${data?.article?.title}` },
    { propetry: 'og:site_name', content: 'EXAMPLE' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:image', content: '[ogp_image_url]' },
    { name: 'twitter:url', content: `/article/${key}` },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:description', content: `${data?.article?.title}` },
    { name: 'twitter:site', content: '[your_twitter_account]' },
    { tagName: 'link', rel: 'canonical', href: `/article/${key}/` },
  ]
}

export default function ArticlePage() {
  const { article } = useLoaderData<typeof loader>()

  return (
    <>
      {article ? (
        <div className="mx-auto w-11/12 md:w-full md:max-w-screen-sm">
          <ArticleHeading article={article} />
          <ArticleBody articleKey={article.key} body={article.body} />
        </div>
      ) : (
        <div>Not found</div>
      )}
    </>
  )
}

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { ArticleHeading } from '~/components/article-heading'
import { Article } from '~/types/article'

export const meta: MetaFunction = () => {
  return [
    { title: 'All posts - EXAMPLE' },
    { name: 'description', content: '記事一覧' },
    { property: 'og:title', content: 'All posts - EXAMPLE' },
    { propetry: 'og:type', content: 'website' },
    { property: 'og:image', content: '[ogp_image_url]' },
    { property: 'og:url', content: '/' },
    { property: 'og:description', content: '記事一覧' },
    { propetry: 'og:site_name', content: 'EXAMPLE' },
    { name: 'twitter:title', content: 'All posts - EXAMPLE' },
    { name: 'twitter:image', content: '[ogp_image_url]' },
    { name: 'twitter:url', content: '/' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:description', content: '記事一覧' },
    { name: 'twitter:site', content: '[your_twitter_account]' },
    { tagName: 'link', rel: 'canonical', href: '/' },
  ]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { results } =
    context.env.DB == null
      ? { results: null }
      : await context.env.DB.prepare(
          'SELECT * FROM articles ORDER BY id DESC',
        ).all<Article>()

  return json({
    articles: results ?? [],
  })
}

export default function Index() {
  const { articles } = useLoaderData<typeof loader>()

  return (
    <div className="mx-auto w-11/12 md:w-full md:max-w-screen-sm">
      {articles.map((article) => (
        <ArticleHeading key={article.key} article={article} />
      ))}
    </div>
  )
}

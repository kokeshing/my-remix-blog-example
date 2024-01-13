import { Article } from '~/types/article'

export function ArticleHeading({ article }: { article: Article }) {
  const { key, title, created_at } = article
  const d = new Date(created_at)
  const dateStr = `${d.getFullYear()}/${('00' + (d.getMonth() + 1)).slice(
    -2,
  )}/${('00' + d.getDate()).slice(-2)}`

  return (
    <a href={'/article/' + key}>
      <div className="my-2 cursor-pointer rounded-lg border border-gray-400 md:flex">
        <div className="m-2">
          <div className="text-sm font-bold uppercase tracking-wide text-blue-600">
            {dateStr}
          </div>
          <p className="mt-1 block text-sm font-semibold leading-tight text-gray-900 hover:underline md:text-lg">
            {title}
          </p>
        </div>
      </div>
    </a>
  )
}

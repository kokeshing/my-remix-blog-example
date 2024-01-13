import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import * as prod from 'react/jsx-runtime'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism-plus'
import rehype2react from 'rehype-react'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import styles from './article-body.module.css'
import { LinkCard } from './link-card'
import './prism.css'
import { YouTubeEmbedding } from './youtube-embedding'

// @ts-expect-error: the react types are missing.
const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs }

export function ArticleBody({
  articleKey,
  body,
}: {
  articleKey: string
  body: string
}) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehype2react, {
      ...production,
      components: {
        img: (props) => {
          const filepath = path.parse(props.src ?? '')
          return (
            <img
              src={`/assets/${articleKey}:${filepath.name}/${filepath.ext}`}
              alt={props.alt ?? ''}
            />
          )
        },
        pre: (props) => {
          if (props.children != null && React.isValidElement(props.children)) {
            const codeLanguage = props.children.props.className.split(' ')[0]
            if (codeLanguage === 'language-card') {
              return (
                <LinkCard
                  href={renderToString(
                    props.children.props.children.props.children,
                  ).trim()}
                />
              )
            } else if (codeLanguage === 'language-audio') {
              const filepath = path.parse(
                renderToString(props.children.props.children.props.children),
              )
              return (
                /* eslint-disable jsx-a11y/media-has-caption */
                <audio
                  className="my-2"
                  src={`/assets/${articleKey}:${filepath.name}/${filepath.ext}`}
                  controls
                />
              )
            } else if (codeLanguage === 'language-youtube') {
              const id = renderToString(
                props.children.props.children.props.children,
              )
              return <YouTubeEmbedding id={id} />
            }
          }
          return <pre {...props}>{props.children}</pre>
        },
      },
    })

  return <div className={styles.root}>{processor.processSync(body).result}</div>
}

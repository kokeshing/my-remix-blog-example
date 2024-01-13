import { FaGithub, FaTwitter } from 'react-icons/fa'

export function Header() {
  return (
    <header className="mx-auto flex h-12 max-w-screen-lg items-center justify-between md:mb-8 md:h-16">
      <div className="flex-none pl-4 sm:pl-6 xl:pl-8">
        <h1 className="block text-left text-xl font-thin md:text-2xl">
          <a href="/">
            Example
          </a>
        </h1>
      </div>
      <div className="flex pr-4 sm:pr-6 xl:pr-8">
        <span className="block pr-2 text-blue-500">
          <a
            target="_blank"
            href="https://twitter.com"
            rel="noreferrer noopener"
            title="Twitter"
          >
            <FaTwitter size={32} />
          </a>
        </span>
        <span className="block">
          <a
            target="_blank"
            href="https://github.com"
            rel="noreferrer noopener"
            title="GitHub"
          >
            <FaGithub size={32} />
          </a>
        </span>
      </div>
    </header>
  )
}

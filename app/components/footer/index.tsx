import { useLocation } from '@remix-run/react'
import { FaTwitter } from 'react-icons/fa'
import { TwitterShareButton } from 'react-share'

export function Footer() {
  const location = useLocation()

  return (
    <footer className="mx-auto mb-2 mt-8 flex h-12 max-w-screen-lg items-center justify-between md:h-16">
      <div className="pl-4 sm:pl-6 xl:pl-8">
        <span>
          © {new Date().getFullYear()}
          {` `}
          <a href="/profile" className="text-blue-600">
            name
          </a>
        </span>
      </div>

      <div className="flex pr-4 sm:pr-6 xl:pr-8">
        <span className="text-s block pr-1 font-bold leading-8">
          Share with:
        </span>
        <span className="block leading-8 text-blue-500">
          <TwitterShareButton
            aria-label="Twitterでこのページを共有する"
            url={`https://google.com${location.pathname}`}
          >
            <FaTwitter size={32} />
          </TwitterShareButton>
        </span>
      </div>
    </footer>
  )
}

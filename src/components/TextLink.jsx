import { Link } from 'react-router-dom'
import ArrowIcon from './icons/ArrowIcon'

function TextLink ({ to, children, className = '' }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2
        py-3 font-medium
        hover:text-accent focus-visible:text-accent
        motion-safe:transition-colors motion-safe:duration-200
        ${className}`}
    >
      <span>{children}</span>

      <ArrowIcon
        className='h-5 w-5 shrink-0
          motion-safe:transition-transform motion-safe:duration-200
          motion-safe:group-hover:translate-x-1
          motion-safe:group-focus-visible:translate-x-1'
      />
    </Link>
  )
}

export default TextLink

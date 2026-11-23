import { ArrowRight, Crown, MapPin, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import './PageStatus.css'

const statusIcons = {
  story: Crown,
  cart: ShoppingBag,
  notFound: MapPin
}

function PageStatus ({
  variant,
  status,
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction
}) {
  const StatusIcon = statusIcons[variant] || Compass

  return (
    <section
      className={'page-status page-status--' + variant}
      aria-labelledby='page-status-title'
    >
      <div className='site-container page-status__inner'>
        <div className='page-status__copy'>
          <p className='page-status__eyebrow'>
            ROADKIT <span aria-hidden='true'>/</span> {eyebrow}
          </p>

          <p className='page-status__label'>
            <StatusIcon aria-hidden='true' size={18} strokeWidth={1.8} />
            {status}
          </p>

          <h1 id='page-status-title' className='page-status__title'>
            {title}
          </h1>
          <p className='page-status__description'>{description}</p>

          <div className='page-status__actions'>
            <Link
              className='page-status__button page-status__button--primary'
              to={primaryAction.to}
            >
              {primaryAction.label}
              <ArrowRight aria-hidden='true' size={18} />
            </Link>
            {secondaryAction && (
              <Link
                className='page-status__button page-status__button--secondary'
                to={secondaryAction.to}
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>

          <p className='page-status__footnote'>為下一段旅程，慢慢做好準備。</p>
        </div>
      </div>
    </section>
  )
}

export default PageStatus
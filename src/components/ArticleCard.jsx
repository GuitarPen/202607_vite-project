import { Link } from 'react-router-dom'
import './ArticleCard.css'

function getArticleDate (createAt) {
  const timestamp = Number(createAt)

  if (!Number.isFinite(timestamp) || timestamp <= 0) return null

  const date = new Date(timestamp * 1000)
  if (Number.isNaN(date.getTime())) return null

  return {
    dateTime: date.toISOString(),
    label: new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date)
  }
}

function ArticleCard ({ article, variant = 'default' }) {
  const isFeatured = variant === 'featured'
  const title = String(article.title ?? '').trim() || '未命名文章'
  const description = String(article.description ?? '').trim()
  const author = String(article.author ?? '').trim()
  const image = String(article.image ?? '').trim()
  const date = getArticleDate(article.create_at)

  return (
    <article
      className={`article-card ${isFeatured ? 'article-card--featured' : ''}`}
    >
      <Link
        to={`/articles/${article.id}`}
        className='article-card-link'
        aria-label={`閱讀文章：${title}`}
      >
        {image ? (
          <div className='article-card-image'>
            <img
              src={image}
              alt={`${title} 封面`}
              loading={isFeatured ? 'eager' : 'lazy'}
            />
          </div>
        ) : (
          <div
            className='article-card-image article-card-image--placeholder'
            role='img'
            aria-label={`${title}沒有封面圖片`}
          >
            <span lang='en'>ROADKIT</span>
            <span>旅途故事</span>
          </div>
        )}

        <div className='article-card-content'>
          {date && (
            <time className='article-card-date' dateTime={date.dateTime}>
              {date.label}
            </time>
          )}

          <h3 className='article-card-title'>{title}</h3>

          {description && (
            <p className='article-card-description'>{description}</p>
          )}

          {author && <p className='article-card-author'>作者：{author}</p>}
        </div>
      </Link>
    </article>
  )
}

export default ArticleCard

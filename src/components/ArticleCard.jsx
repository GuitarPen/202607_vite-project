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

function getSampleViewCount (articleId) {
  const id = String(articleId ?? '')
  if (!id) return '—'

  let hash = 2166136261

  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return (hash >>> 0) % 1000
}

function ArticleCard ({ article }) {
  const title = String(article.title ?? '').trim() || '未命名文章'
  const description = String(article.description ?? '').trim()
  const author = String(article.author ?? '').trim()
  const image = String(article.image ?? '').trim()
  const date = getArticleDate(article.create_at)
  const viewCount = getSampleViewCount(article.id)

  return (
    <article className='article-card'>
      <Link
        to={`/articles/${article.id}`}
        className='article-card-link'
        aria-label={`閱讀文章：${title}`}
      >
        {image ? (
          <div className='article-card-image'>
            <img src={image} alt={`${title} 封面`} loading='lazy' />
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

          <h2 className='article-card-title'>{title}</h2>

          {description && (
            <p className='article-card-description'>{description}</p>
          )}

          <div className='article-card-meta'>
            {author && <span>作者：{author}</span>}
            <span>觀看次數：{viewCount}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ArticleCard

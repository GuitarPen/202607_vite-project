import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import TextLink from '../components/TextLink'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './ArticlesDetail.css'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env
const articlesApi = `${VITE_API_URL}/v2/api/${VITE_API_PATH}/articles`

function ArticlesDetail () {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [adjacentArticles, setAdjacentArticles] = useState({
    previous: null,
    next: null
  })

  useEffect(() => {
    const controller = new AbortController()

    setArticle(null)
    setLoading(true)
    setError('')
    setNotFound(false)
    setImageError(false)
    setAdjacentArticles({ previous: null, next: null })

    if (!id) {
      setNotFound(true)
      setLoading(false)
      return () => controller.abort()
    }

    // 取得目前文章的內容
    async function getArticle () {
      try {
        const response = await axios.get(
          `${VITE_API_URL}/v2/api/${VITE_API_PATH}/article/${id}`,
          { signal: controller.signal }
        )

        if (!response.data?.article) {
          setNotFound(true)
          return
        }

        setArticle(response.data.article)
      } catch (requestError) {
        if (controller.signal.aborted) return

        if (requestError.response?.status === 404) {
          setNotFound(true)
        } else {
          setError('文章載入失敗，請稍後再試。')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    // 取得文章清單，找出目前文章的上一篇和下一篇
    async function getAdjacentArticles () {
      try {
        let collectedArticles = []
        let totalApiPages = 1

        for (let page = 1; page <= totalApiPages; page += 1) {
          const response = await axios.get(
            articlesApi,
            {
              params: { page },
              signal: controller.signal
            }
          )

          if (
            response.data?.success === false ||
            !Array.isArray(response.data?.articles)
          ) {
            throw new Error('文章資料格式不正確。')
          }

          collectedArticles = collectedArticles.concat(response.data.articles)

          if (response.data.pagination) {
            totalApiPages = Number(response.data.pagination.total_pages) || 1
          }
        }

        const articles = collectedArticles
          .filter(item => item && item.id != null)

        const currentIndex = articles.findIndex(
          item => String(item.id) === String(id)
        )

        if (controller.signal.aborted || currentIndex < 0) return

        setAdjacentArticles({
          previous: articles[currentIndex - 1] ?? null,
          next: articles[currentIndex + 1] ?? null
        })
      } catch {
        // 相鄰文章導覽為選用內容，列表載入失敗時仍可正常閱讀文章。
      }
    }

    getArticle()
    getAdjacentArticles()

    return () => controller.abort()
  }, [id])

  const renderMessage = (message, isError = false) => (
    <div className='article-detail-message'>
      <p role={isError ? 'alert' : 'status'}>{message}</p>
      {!loading && (
        <Link className='article-detail-message-link' to='/articles'>
          返回文章列表
        </Link>
      )}
    </div>
  )

  const createdAt = Number(article?.create_at)
  const createdAtDate =
    Number.isFinite(createdAt) && createdAt > 0
      ? new Date(createdAt * 1000)
      : null
  const hasValidDate = createdAtDate && Number.isFinite(createdAtDate.getTime())
  const titleFromApi =
    typeof article?.title === 'string' ? article.title.trim() : ''
  const articleTitle = titleFromApi || (article ? '未命名文章' : '文章')
  const author =
    typeof article?.author === 'string' ? article.author.trim() : ''
  const description =
    typeof article?.description === 'string' ? article.description.trim() : ''
  const content = typeof article?.content === 'string' ? article.content : ''
  const image = typeof article?.image === 'string' ? article.image.trim() : ''
  const tags = Array.isArray(article?.tag)
    ? article.tag.filter(tag => typeof tag === 'string' && tag.trim())
    : []
  const contentParagraphs = content.trim()
    ? content
        .split(/\r?\n(?:[\t ]*\r?\n)+/)
        .filter(paragraph => paragraph.trim())
    : []

  return (
    <section className='article-detail-page'>
      <header className='article-detail-banner'>
        <div className='site-container'>
          <p className='article-detail-banner-title'>
            旅行誌
            <span lang='en'>TRAVEL LOG</span>
          </p>
        </div>
      </header>

      <div className='site-container article-detail-container'>
        <nav className='article-detail-breadcrumb' aria-label='麵包屑'>
          <ol>
            <li>
              <Link to='/'>首頁</Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li>
              <Link to='/articles'>旅行文章</Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li aria-current='page'>{articleTitle}</li>
          </ol>
        </nav>

        {loading && renderMessage('文章載入中…')}
        {!loading && error && renderMessage(error, true)}
        {!loading && !error && notFound && renderMessage('找不到這篇文章。')}

        {!loading && !error && !notFound && article && (
          <article className='article-detail'>
            <header className='article-detail-header'>
              <p className='article-detail-eyebrow' lang='en'>
                TRAVEL STORY
              </p>
              <h1>{articleTitle}</h1>

              {(author || hasValidDate) && (
                <div className='article-detail-meta'>
                  {author && <span>作者：{author}</span>}
                  {author && hasValidDate && (
                    <span
                      className='article-detail-meta-separator'
                      aria-hidden='true'
                    >
                      ·
                    </span>
                  )}
                  {hasValidDate && (
                    <time dateTime={createdAtDate.toISOString()}>
                      {createdAtDate.toLocaleDateString('zh-TW-u-ca-gregory', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                </div>
              )}

              {tags.length > 0 && (
                <ul className='article-detail-tags' aria-label='文章標籤'>
                  {tags.map((tag, index) => (
                    <li key={`${tag}-${index}`}>{tag.trim()}</li>
                  ))}
                </ul>
              )}
            </header>

            <figure className='article-detail-cover'>
              {image && !imageError ? (
                <img
                  src={image}
                  alt={articleTitle}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className='article-detail-cover-placeholder'
                  role='img'
                  aria-label={
                    image ? '封面圖片載入失敗' : '此篇文章沒有封面圖片'
                  }
                >
                  <span>ROADKIT</span>
                  <span lang='en'>TRAVEL LOG</span>
                </div>
              )}
            </figure>

            <div className='article-detail-reading'>
              {description && (
                <div className='article-detail-summary'>
                  <p>{description}</p>
                </div>
              )}

              <section className='article-detail-body' aria-label='文章內文'>
                {contentParagraphs.length > 0 ? (
                  <div className='article-detail-content'>
                    {contentParagraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className='article-detail-empty'>此篇文章目前沒有內文。</p>
                )}
              </section>

              <footer className='article-detail-footer'>
                <div className='article-detail-all-link'>
                  <TextLink to='/articles'>查看所有文章</TextLink>
                </div>

                {(adjacentArticles.previous || adjacentArticles.next) && (
                  <nav
                    className='article-detail-neighbors'
                    aria-label='相鄰文章'
                  >
                    {adjacentArticles.previous ? (
                      <Link
                        to={`/articles/${adjacentArticles.previous.id}`}
                        className='article-detail-neighbor article-detail-neighbor--previous'
                        aria-label={`上一篇文章：${
                          adjacentArticles.previous.title || '未命名文章'
                        }`}
                      >
                        <span
                          className='article-detail-neighbor-arrow'
                          aria-hidden='true'
                        >
                          <ChevronLeft
                            aria-hidden='true'
                            size={18}
                            strokeWidth={1.75}
                          />
                        </span>
                        <span className='article-detail-neighbor-title'>
                          {adjacentArticles.previous.title || '未命名文章'}
                        </span>
                      </Link>
                    ) : (
                      <span aria-hidden='true' />
                    )}

                    {adjacentArticles.next ? (
                      <Link
                        to={`/articles/${adjacentArticles.next.id}`}
                        className='article-detail-neighbor article-detail-neighbor--next'
                        aria-label={`下一篇文章：${
                          adjacentArticles.next.title || '未命名文章'
                        }`}
                      >
                        <span className='article-detail-neighbor-title'>
                          {adjacentArticles.next.title || '未命名文章'}
                        </span>
                        <span
                          className='article-detail-neighbor-arrow'
                          aria-hidden='true'
                        >
                          <ChevronRight
                            aria-hidden='true'
                            size={18}
                            strokeWidth={1.75}
                          />
                        </span>
                      </Link>
                    ) : (
                      <span aria-hidden='true' />
                    )}
                  </nav>
                )}
              </footer>
            </div>
          </article>
        )}
      </div>
    </section>
  )
}

export default ArticlesDetail

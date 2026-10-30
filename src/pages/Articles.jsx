import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import './Articles.css'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env
const articlesApi = `${VITE_API_URL}/v2/api/${VITE_API_PATH}/articles`

function Articles () {
  const [articles, setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadArticles () {
      setLoading(true)
      setError('')

      try {
        const response = await axios.get(articlesApi, {
          signal: controller.signal
        })

        if (
          response.data?.success === false ||
          !Array.isArray(response.data?.articles)
        ) {
          throw new Error('文章資料格式不正確。')
        }

        setArticles(response.data.articles)
      } catch {
        if (!controller.signal.aborted) {
          setError('文章載入失敗，請稍後再試。')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadArticles()

    return () => controller.abort()
  }, [loadAttempt])

  const filteredArticles = useMemo(() => {
    const keyword = searchTerm.trim().toLocaleLowerCase('zh-TW')

    if (!keyword) return articles

    return articles.filter(article => {
      const title = String(article.title ?? '').toLocaleLowerCase('zh-TW')
      const description = String(article.description ?? '')
        .toLocaleLowerCase('zh-TW')
      return title.includes(keyword) || description.includes(keyword)
    })
  }, [articles, searchTerm])

  const featuredArticle = filteredArticles[0]
  const remainingArticles = filteredArticles.slice(1)
  const hasSearch = searchTerm.trim().length > 0

  return (
    <div className='articles-page'>
      <header className='articles-banner' aria-labelledby='articles-title'>
        <div className='site-container'>
          <h1 id='articles-title'>
            旅行文章
            <span lang='en'>TRAVEL JOURNAL</span>
          </h1>
        </div>
      </header>

      <div className='site-container articles-container'>
        <nav aria-label='麵包屑' className='articles-breadcrumb'>
          <ol>
            <li>
              <Link to='/'>首頁</Link>
            </li>
            <li aria-current='page'>
              <span aria-hidden='true' className='articles-breadcrumb-separator'>
                /
              </span>
              旅行文章
            </li>
          </ol>
        </nav>

        <section className='articles-toolbar' aria-label='搜尋文章'>
          <div className='articles-search'>
            <label htmlFor='article-search'>搜尋文章</label>
            <div className='articles-search-field'>
              <input
                id='article-search'
                type='search'
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder='輸入文章標題或摘要'
                autoComplete='off'
              />
              {searchTerm && (
                <button
                  type='button'
                  className='articles-search-clear'
                  onClick={() => setSearchTerm('')}
                  aria-label='清除搜尋'
                >
                  清除
                </button>
              )}
            </div>
          </div>

          {!loading && !error && (
            <p className='articles-count' role='status' aria-live='polite'>
              {hasSearch
                ? `找到 ${filteredArticles.length} 篇文章`
                : `共 ${articles.length} 篇文章`}
            </p>
          )}
        </section>

        {loading && (
          <p className='articles-state' role='status'>
            文章載入中…
          </p>
        )}

        {!loading && error && (
          <div className='articles-state' role='alert'>
            <p>{error}</p>
            <button
              type='button'
              className='articles-state-action'
              onClick={() => setLoadAttempt(attempt => attempt + 1)}
            >
              重新載入
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <p className='articles-state' role='status'>
            目前還沒有公開文章。
          </p>
        )}

        {!loading &&
          !error &&
          articles.length > 0 &&
          filteredArticles.length === 0 && (
          <div className='articles-state' role='status'>
            <p>找不到符合「{searchTerm.trim()}」的文章。</p>
            <button
              type='button'
              className='articles-state-action'
              onClick={() => setSearchTerm('')}
            >
              清除搜尋
            </button>
          </div>
        )}

        {!loading && !error && featuredArticle && (
          <>
            <section
              className='articles-featured-section'
              aria-labelledby='articles-featured-title'
            >
              <div className='articles-section-heading'>
                <h2 id='articles-featured-title'>
                  {hasSearch ? '符合條件的焦點文章' : '焦點文章'}
                </h2>
                <span lang='en'>FEATURED STORY</span>
              </div>
              <ArticleCard article={featuredArticle} variant='featured' />
            </section>

            {remainingArticles.length > 0 && (
              <section
                className='articles-list-section'
                aria-labelledby='articles-list-title'
              >
                <div className='articles-section-heading'>
                  <h2 id='articles-list-title'>
                    {hasSearch ? '其他搜尋結果' : '更多旅行文章'}
                  </h2>
                  <span lang='en'>MORE STORIES</span>
                </div>
                <div className='articles-grid'>
                  {remainingArticles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Articles

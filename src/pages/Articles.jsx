import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import './Articles.css'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env
const articlesApi = `${VITE_API_URL}/v2/api/${VITE_API_PATH}/articles`

function Articles () {
  const [articles, setArticles] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    // 元件卸載或重新載入時，取消尚未完成的舊請求。
    const controller = new AbortController()

    // 載入所有 API 分頁的文章資料，並更新載入與錯誤狀態。
    async function loadArticles () {
      setLoading(true)
      setError('')

      try {
        let collectedArticles = []
        let totalApiPages = 1

        // 依 API 回傳的總頁數逐頁收集，避免只取得第一頁文章。
        for (let page = 1; page <= totalApiPages; page += 1) {
          const response = await axios.get(articlesApi, {
            params: { page },
            signal: controller.signal
          })

          // console.log('本頁文章資料：', response.data);

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

        if (!controller.signal.aborted) {
          setArticles(collectedArticles)
          setCurrentPage(1)
        }
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

  // 全部文章載入後，在前端每頁顯示 10 篇。
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(articles.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const visibleArticles = articles.slice(startIndex, startIndex + pageSize)

  return (
    <div className='articles-page'>
      <header className='articles-banner' aria-labelledby='articles-title'>
        <div className='site-container'>
          <h1 id='articles-title'>
            旅行誌
            <span lang='en'>TRAVEL LOG</span>
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

        <section className='articles-toolbar' aria-label='文章列表工具'>
          <p role='status' aria-live='polite'>
            {loading
              ? '文章載入中…'
              : error
                ? '暫時無法取得文章數量'
                : `共 ${articles.length} 篇文章`}
          </p>

          <div className='articles-sort'>
            <label htmlFor='article-sort'>排序：</label>
            <select id='article-sort' defaultValue='default'>
              <option value='default'>預設排序</option>
              <option value='date-desc'>日期新到舊</option>
              <option value='date-asc'>日期舊到新</option>
            </select>
          </div>
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

        {!loading && !error && articles.length > 0 && (
          <>
            <section aria-label='旅行文章列表'>
              <div className='articles-grid'>
                {visibleArticles.map(article => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                ))}
              </div>
            </section>

            {/* 上一頁／下一頁 */}
            <nav
              aria-label='文章列表分頁'
              className='articles-pagination'
            >
              {currentPage > 1 && (
                <button
                  type='button'
                  className='articles-pagination-button'
                  aria-label='上一頁'
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft aria-hidden='true' size={18} strokeWidth={1.75} />
                </button>
              )}

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                <button
                  key={page}
                  type='button'
                  className='articles-pagination-button'
                  aria-current={currentPage === page ? 'page' : undefined}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              {currentPage < totalPages && (
                <button
                  type='button'
                  className='articles-pagination-button'
                  aria-label='下一頁'
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight aria-hidden='true' size={18} strokeWidth={1.75} />
                </button>
              )}

              <span className='sr-only' aria-live='polite'>
                第 {currentPage} 頁，共 {totalPages} 頁
              </span>
            </nav>
          </>
        )}
      </div>
    </div>
  )
}

export default Articles

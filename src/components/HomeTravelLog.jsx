import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './HomeTravelLog.css'
import TextLink from './TextLink'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env
const articlesApi = `${VITE_API_URL}/v2/api/${VITE_API_PATH}/articles`

function HomeTravelLog () {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    async function loadLatestArticles () {
      try {
        let collectedArticles = []
        let totalApiPages = 1

        for (let page = 1; page <= totalApiPages; page += 1) {
          const response = await axios.get(articlesApi, {
            params: { page },
            signal: controller.signal
          })

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

        const latestArticles = collectedArticles
          .filter(article => article && article.id != null)
          .sort(
            (left, right) =>
              Number(right.create_at || 0) - Number(left.create_at || 0)
          )
          .slice(0, 3)

        if (!controller.signal.aborted) {
          setArticles(latestArticles)
        }
      } catch {
        if (!controller.signal.aborted) {
          setArticles([])
        }
      }
    }

    loadLatestArticles()

    return () => controller.abort()
  }, [])

  return (
    <>
      <div className='featured-heading justify-center mb-12'>
        <h2 id='travel-log-title'>旅行誌</h2>
        <p lang='en'>TRAVEL LOG</p>
      </div>

      <div className='travel-log-layout'>
        {articles.map((article, index) => (
          <article
            key={article.id}
            className={`travel-article ${
              ['article-card-main', 'article-card-top', 'article-card-bottom'][
                index
              ]
            }`}
          >
            <Link className='link' to={`/articles/${article.id}`}>
              <div className='image'>
                <img src={article.image} alt={article.title} loading='lazy' />
              </div>

              <div className='content'>
                <time
                  dateTime={new Date(article.create_at * 1000).toISOString()}
                >
                  {new Date(article.create_at * 1000).toLocaleDateString(
                    'zh-TW'
                  )}
                </time>
                <h3 className='title'>{article.title}</h3>

                <p className='description'>{article.description}</p>

                <div className='meta'>
                  <span>作者：{article.author}</span>
                  <span>觀看次數：{[355, 3, 139][index] ?? '—'}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className='mt-8 text-right'>
        <TextLink to='/articles'>查看所有文章</TextLink>
      </div>
    </>
  )
}

export default HomeTravelLog

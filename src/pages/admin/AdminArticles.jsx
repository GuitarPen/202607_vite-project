import axios from 'axios'
import { useEffect, useState } from 'react'
import ArticleModal from '../../components/ArticleModal'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env
const articleApi = `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin`

function AdminArticles () {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedArticleId, setSelectedArticleId] = useState(null)

  // 進入頁面、儲存或刪除成功後，直接呼叫此函式更新列表
  async function getArticles () {
    setLoading(true)
    setError('')

    try {
      // 讀取登入時儲存的 Token
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )

      if (!token) {
        throw new Error('請先登入後台')
      }

      axios.defaults.headers.common.Authorization = token
      const response = await axios.get(`${articleApi}/articles`)

      if (response.data.success === false) {
        throw new Error('取得文章列表失敗')
      }

      if (!Array.isArray(response.data.articles)) {
        throw new Error('文章列表格式與預期不同，請確認 API 回應')
      }

      setArticles(response.data.articles)
    } catch (error) {
      setError(error.message || '文章載入失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getArticles()
  }, [])

  const handleOpenCreate = () => {
    setModalMode('create')
    setSelectedArticleId(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = id => {
    setModalMode('edit')
    setSelectedArticleId(id)
    setIsModalOpen(true)
  }

  // 刪除文章
  const handleDelete = async id => {
    if (!window.confirm('確定要刪除這篇文章嗎？')) return

    try {
      const response = await axios.delete(`${articleApi}/article/${id}`)

      // 確認 API 回報刪除成功
      if (!response.data.success) {
        throw new Error('刪除失敗')
      }

      alert('刪除成功')
      getArticles()
    } catch {
      alert('刪除失敗')
    }
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>文章管理</h1>
        <button
          type='button'
          disabled={isModalOpen}
          onClick={handleOpenCreate}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          新增文章
        </button>
      </div>

      <ArticleModal
        isOpen={isModalOpen}
        mode={modalMode}
        articleId={selectedArticleId}
        onClose={() => setIsModalOpen(false)}
        onSuccess={getArticles}
      />

      {loading && <p role='status'>文章載入中…</p>}
      {error && <p role='alert'>{error}</p>}

      {!loading &&
        !error &&
        (articles.length === 0 ? (
          <p>目前沒有文章。</p>
        ) : (
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border p-2 text-left'>文章標題</th>
                <th className='border p-2 text-left'>作者</th>
                <th className='border p-2 text-left'>是否公開</th>
                <th className='border p-2 text-left'>操作</th>
              </tr>
            </thead>

            <tbody>
              {articles.map(article => (
                <tr key={article.id}>
                  <td className='border p-2'>{article.title}</td>
                  <td className='border p-2'>{article.author}</td>
                  <td className='border p-2'>
                    <span
                      className={
                        article.isPublic ? 'text-green-500' : 'text-red-500'
                      }
                    >
                      {article.isPublic ? '公開' : '未公開'}
                    </span>
                  </td>
                  <td className='border p-2'>
                    <button
                      type='button'
                      disabled={isModalOpen}
                      onClick={() => handleOpenEdit(article.id)}
                      className='bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500'
                    >
                      編輯
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDelete(article.id)}
                      className='ml-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600'
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </div>
  )
}

export default AdminArticles

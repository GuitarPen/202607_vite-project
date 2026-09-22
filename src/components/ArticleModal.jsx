import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env
const articleApi = `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin`

// 新增文章時的預設資料
const createEmptyArticle = () => ({
  title: '',
  description: '',
  image: '',
  author: '',
  content: '',
  tag: [],
  isPublic: false,
  create_at: Math.floor(Date.now() / 1000)
})

// 每次請求都帶上登入 Token
const getRequestConfig = () => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  )

  if (!token) {
    throw new Error('請先登入後台')
  }

  return {
    headers: {
      Authorization: token
    }
  }
}

// API 的錯誤訊息可能是字串或陣列
const getErrorMessage = error => {
  const message = error.response?.data?.message ?? error.message

  return Array.isArray(message)
    ? message.join('、')
    : String(message || '操作失敗，請稍後再試')
}

// 對外使用的元件：負責控制開關
function ArticleModal ({ isOpen, onClose, mode, articleId, onSuccess }) {
  if (!isOpen) return null

  return (
    <ArticleEditor
      key={mode === 'edit' ? articleId : 'create'}
      mode={mode}
      articleId={articleId}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}

// 彈窗內部：負責文章表單與 API
function ArticleEditor ({ mode, articleId, onClose, onSuccess }) {
  const isEdit = mode === 'edit'
  const dialogRef = useRef(null)

  const [form, setForm] = useState(createEmptyArticle)
  const [tagText, setTagText] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')

  // 開啟彈窗，並暫停背景頁面捲動
  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow

    if (!dialog.open) {
      dialog.showModal()
    }

    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // 編輯模式：取得單篇文章完整資料
  useEffect(() => {
    if (!isEdit) return

    if (!articleId) {
      setLoadError('缺少文章 ID，無法載入文章。')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function getArticle () {
      setLoading(true)
      setLoadError('')

      try {
        const response = await axios.get(`${articleApi}/article/${articleId}`, {
          ...getRequestConfig(),
          signal: controller.signal
        })

        if (!response.data.success || !response.data.article) {
          throw new Error('取得文章內容失敗')
        }

        const article = response.data.article
        const tags = Array.isArray(article.tag) ? article.tag : []

        setForm({
          title: article.title ?? '',
          description: article.description ?? '',
          image: article.image ?? '',
          author: article.author ?? '',
          content: article.content ?? '',
          tag: tags,
          isPublic: article.isPublic === true,
          create_at: article.create_at
        })

        setTagText(tags.join(', '))
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(getErrorMessage(error))
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    getArticle()

    return () => controller.abort()
  }, [isEdit, articleId])

  // 更新表單欄位
  const handleChange = event => {
    const { name, value, type, checked } = event.target

    setForm(previous => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // 儲存期間不允許關閉彈窗
  const handleClose = () => {
    if (saving) return
    onClose()
  }

  // 新增或更新文章
  const handleSubmit = async event => {
    event.preventDefault()
    if (saving || loading || loadError) return

    setSaving(true)
    setSaveError('')

    try {
      const data = {
        ...form,
        title: form.title.trim(),
        tag: tagText
          .split(/[,，]/)
          .map(tag => tag.trim())
          .filter(Boolean)
      }

      if (!data.title) {
        throw new Error('請輸入文章標題')
      }

      let response

      if (mode === 'create') {
        response = await axios.post(
          `${articleApi}/article`,
          { data },
          getRequestConfig()
        )
      } else {
        response = await axios.put(
          `${articleApi}/article/${articleId}`,
          { data },
          getRequestConfig()
        )
      }

      if (!response.data.success) {
        const message = response.data.message

        throw new Error(
          Array.isArray(message) ? message.join('、') : message || '儲存失敗'
        )
      }
    } catch (error) {
      setSaveError(getErrorMessage(error))
      setSaving(false)
      return
    }

    setSaving(false)
    alert(mode === 'create' ? '新增成功' : '修改成功')

    // 通知父元件更新列表，再關閉彈窗
    onSuccess()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby='article-modal-title'
      onCancel={event => {
        // 攔截 Escape，統一交給 React 狀態控制關閉
        event.preventDefault()
        handleClose()
      }}
      className='fixed inset-0 m-auto
        max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl
        overflow-y-auto rounded-xl border-0
        bg-paper p-6 text-ink shadow-xl
        backdrop:bg-black/50'
    >
      {/* 標題與關閉按鈕 */}
      <div className='mb-6 flex items-center justify-between gap-4'>
        <h2 id='article-modal-title' className='text-xl font-bold'>
          {isEdit ? '編輯文章' : '新增文章'}
        </h2>

        <button
          type='button'
          onClick={handleClose}
          disabled={saving}
          aria-label='關閉文章編輯視窗'
          className='inline-flex size-10 shrink-0
            items-center justify-center rounded
            hover:bg-sand disabled:opacity-50'
        >
          <span aria-hidden='true'>✕</span>
        </button>
      </div>

      {loading && <p role='status'>文章內容載入中…</p>}

      {loadError && (
        <p role='alert' className='text-red-600'>
          {loadError}
        </p>
      )}

      {!loading && !loadError && (
        <form onSubmit={handleSubmit} aria-busy={saving}>
          <fieldset disabled={saving} className='space-y-4'>
            <label className='block'>
              <span className='mb-1 block'>文章標題</span>
              <input
                type='text'
                name='title'
                value={form.title}
                onChange={handleChange}
                required
                className='form-input'
              />
            </label>

            <label className='block'>
              <span className='mb-1 block'>作者</span>
              <input
                type='text'
                name='author'
                value={form.author}
                onChange={handleChange}
                className='form-input'
              />
            </label>

            <label className='block'>
              <span className='mb-1 block'>封面圖片網址</span>
              <input
                type='url'
                name='image'
                value={form.image}
                onChange={handleChange}
                className='form-input'
                placeholder='https://example.com/image.jpg'
              />
            </label>

            <label className='block'>
              <span className='mb-1 block'>文章摘要</span>
              <textarea
                name='description'
                rows={3}
                value={form.description}
                onChange={handleChange}
                className='form-input'
              />
            </label>

            <label className='block'>
              <span className='mb-1 block'>完整內文</span>
              <textarea
                name='content'
                rows={10}
                value={form.content}
                onChange={handleChange}
                className='form-input'
              />
            </label>

            <label className='block'>
              <span className='mb-1 block'>標籤（以逗號分隔）</span>
              <input
                type='text'
                value={tagText}
                onChange={event => setTagText(event.target.value)}
                className='form-input'
                placeholder='公路旅行, 露營'
              />
            </label>

            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                name='isPublic'
                checked={form.isPublic}
                onChange={handleChange}
              />
              公開文章
            </label>

            {saveError && (
              <p role='alert' className='text-red-600'>
                {saveError}
              </p>
            )}

            <div className='flex justify-end gap-3 border-t border-sand pt-4'>
              <button
                type='button'
                onClick={handleClose}
                className='rounded border px-4 py-2
                  hover:bg-sand disabled:opacity-50'
              >
                取消
              </button>

              <button
                type='submit'
                className='rounded bg-brand px-4 py-2
                  text-white disabled:opacity-50'
              >
                {saving ? '儲存中…' : isEdit ? '儲存變更' : '新增文章'}
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </dialog>
  )
}

export default ArticleModal

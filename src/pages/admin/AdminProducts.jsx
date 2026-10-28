import axios from 'axios'
import { useEffect, useState } from 'react'
import ProductModal from '../../components/ProductModal'

const VITE_API_URL = import.meta.env.VITE_API_URL
const VITE_API_PATH = import.meta.env.VITE_API_PATH

function AdminProducts () {
  const [products, setProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [pagination, setPagination] = useState({
    current_page: 1, // 目前頁碼
    total_pages: 1, // 總頁數
    has_pre: false, // 是否有上一頁
    has_next: false // 是否有下一頁
  })
  const [loading, setLoading] = useState(false)

  // 取得商品列表
  const getProducts = async (page = 1) => {
    setLoading(true)

    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )
      axios.defaults.headers.common['Authorization'] = token

      const res = await axios.get(
        `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin/products`,
        {
          params: {
            page: page
          }
        }
      )

      if (!res.data.success) {
        throw new Error('取得商品列表失敗')
      }

      // 有商品資料就使用它，否則使用空陣列
      if (res.data.products) {
        setProducts(res.data.products)
      } else {
        setProducts([])
      }
      setPagination(res.data.pagination)

      // console.log('取得商品列表成功', res.data.products)
      // console.log('本頁商品數量：', res.data.products.length)
      // console.log('分頁資訊：', res.data.pagination)
    } catch {
      alert('取得商品列表失敗')
      // console.log('取得商品列表失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  // 開啟新增 Modal
  const handleOpenCreate = () => {
    setModalMode('create')
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  // 開啟編輯 Modal
  const handleOpenEdit = (product) => {
    setModalMode('edit')
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  // 刪除商品
  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這個商品嗎？')) {
      return
    }
    try {
      const response = await axios.delete(
        `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin/product/${id}`
      )
      if (!response.data.success) {
        throw new Error('刪除失敗')
      }

      alert('刪除成功')

      // 本頁只剩一筆，刪除後就退回上一頁
      if (products.length === 1 && pagination.current_page > 1) {
        getProducts(pagination.current_page - 1)
      } else {
        getProducts(pagination.current_page)
      }

    } catch {
      alert('刪除失敗')
    }
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>商品管理</h1>
        <button
          onClick={handleOpenCreate}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer'
        >
          新增商品
        </button>
      </div>

      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border p-2 text-left'>商品名稱</th>
            <th className='border p-2 text-left'>分類</th>
            <th className='border p-2 text-left'>原價</th>
            <th className='border p-2 text-left'>售價</th>
            <th className='border p-2 text-left'>是否啟用</th>
            <th className='border p-2 text-left'>操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className='hover:bg-gray-50'>
              <td className='border p-2'>{product.title}</td>
              <td className='border p-2'>{product.category}</td>
              <td className='border p-2'>{product.origin_price}</td>
              <td className='border p-2'>{product.price}</td>
              <td className='border p-2'>
                <span
                  className={
                    product.is_enabled ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {product.is_enabled ? '啟用' : '未啟用'}
                </span>
              </td>
              <td className='border p-2 flex gap-2'>
                <button
                  onClick={() => handleOpenEdit(product)}
                  className='bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 cursor-pointer'
                >
                  編輯
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer'
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav
        aria-label='商品列表分頁'
        className='mt-6 flex items-center justify-center gap-4'
      >
        <button
          type='button'
          disabled={loading || !pagination.has_pre}
          onClick={() => {
            getProducts(pagination.current_page - 1)
          }}
          className='cursor-pointer rounded border px-4 py-2 hover:bg-sand
          disabled:cursor-not-allowed disabled:opacity-40'
        >
          上一頁
        </button>

        <span aria-live='polite'>
          {loading
            ? '載入中…'
            : `第 ${pagination.current_page} 頁／共 ${pagination.total_pages} 頁`}
        </span>

        <button
          type='button'
          disabled={loading || !pagination.has_next}
          onClick={() => {
            getProducts(pagination.current_page + 1)
          }}
          className='cursor-pointer rounded border px-4 py-2 hover:bg-sand
          disabled:cursor-not-allowed disabled:opacity-40'
        >
          下一頁
        </button>
      </nav>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        mode={modalMode}
        product={selectedProduct}
        onSuccess={() => {
          getProducts(pagination.current_page)
        }}
      />
    </div>
  )
}

export default AdminProducts

import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Products.css'
import ProductCard from '../components/ProductCard'
import ProductFilters from '../components/ProductFilters'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env

function Products () {
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    // 離開頁面時取消請求，避免舊請求繼續更新畫面。
    const controller = new AbortController()
    const getAllProducts = async () => {
      setLoading(true)
      try {
        let collected = []
        let totalPages = 1
        // 逐頁取得資料，concat 將每頁商品接到陣列後面。
        for (let page = 1; page <= totalPages; page += 1) {
          const res = await axios.get(
            VITE_API_URL + '/v2/api/' + VITE_API_PATH + '/products',
            { params: { page: page }, signal: controller.signal }
          )
          if (!res.data.success || !Array.isArray(res.data.products)) {
            throw new Error('Failed to load products')
          }
          collected = collected.concat(res.data.products)
          if (res.data.pagination) {
            totalPages = Number(res.data.pagination.total_pages) || 1
          }
        }
        if (!controller.signal.aborted) {
          setAllProducts(collected)
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('商品載入失敗，請重新整理頁面再試一次。')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
    getAllProducts()
    return () => controller.abort()
  }, [])

  // 分類重複時不再加入，先不計算各分類數量。
  const categories = []
  allProducts.forEach((product) => {
    if (product.category && !categories.includes(product.category)) {
      categories.push(product.category)
    }
  })

  // 空字串代表全部商品，其他情況只保留分類相同的商品。
  const filteredProducts = allProducts.filter((product) => {
    if (selectedCategory === '') {
      return true
    }
    return product.category === selectedCategory
  })

  // 先篩選再分頁，每頁十筆；slice 不會修改原本陣列。
  const pageSize = 10
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const products = filteredProducts.slice(startIndex, startIndex + pageSize)

  const changeCategory = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  return (
    <>
      <div className='products-page'>
        {/* 1. 頁面主視覺 */}
        <header className='products-banner'>
          <div className='site-container'>
            <h1>
              精選商品
              <span lang='en'>GEAR PICKS</span>
            </h1>
          </div>
        </header>
        <div className='site-container products-container'>
          {/* 2. 麵包屑 */}
          <nav aria-label='麵包屑' className='products-breadcrumb'>
            <ol>
              <li>
                <Link to='/'>首頁</Link>
              </li>
              <li aria-current='page'>
                <span
                  aria-hidden='true'
                  className='products-breadcrumb-separator'
                >
                  /
                </span>
                全部精選商品
              </li>
            </ol>
          </nav>
          {/* 3. 左右欄 */}
          <div className='products-layout'>
            <aside className='products-sidebar' aria-label='商品篩選'>
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={changeCategory}
                disabled={loading || Boolean(error)}
              />
            </aside>
            <section className='products-results' aria-label='商品列表'>
              {/* 商品數量與排序 */}
              <div className='products-toolbar'>
                <p aria-live='polite'>
                  {loading
                    ? '商品載入中…'
                    : error
                    ? '暫時無法取得商品數量'
                    : `共 ${filteredProducts.length} 件商品`}
                </p>
                {/* 先保留選單外觀，之後再接價格排序邏輯 */}
                <div className='products-sort'>
                  <label htmlFor='product-sort'>排序：</label>
                  <select id='product-sort' defaultValue='default'>
                    <option value='default'>預設排序</option>
                    <option value='price-asc'>價格低到高</option>
                    <option value='price-desc'>價格高到低</option>
                  </select>
                </div>
              </div>

              {error && (
                <div role='alert' className='products-message'>
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && products.length === 0 && (
                <p role='status' className='products-message'>
                  沒有符合條件的商品，請調整或清除篩選。
                </p>
              )}

              {!loading && !error && products.length > 0 && (
                <>
                  <ul className='products-grid'>
                    {products.map(product => (
                      <li key={product.id}>
                        <ProductCard product={product} />
                      </li>
                    ))}
                  </ul>

                  {/* 上一頁／下一頁 */}
                  <nav
                    aria-label='商品列表分頁'
                    className='my-6 flex items-center justify-center gap-4'
                  >
                    <button
                      type='button'
                      disabled={loading || currentPage <= 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className='cursor-pointer rounded border px-4 py-2 hover:bg-sand
                  disabled:cursor-not-allowed disabled:opacity-40'
                    >
                      上一頁
                    </button>

                    <span aria-live='polite'>
                      {loading
                        ? '載入中…'
                        : `第 ${currentPage} 頁／共 ${totalPages} 頁`}
                    </span>

                    <button
                      type='button'
                      disabled={loading || currentPage >= totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className='cursor-pointer rounded border px-4 py-2 hover:bg-sand
                  disabled:cursor-not-allowed disabled:opacity-40'
                    >
                      下一頁
                    </button>
                  </nav>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default Products

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './HomeGearPicks.css'
import ArrowIcon from './icons/ArrowIcon'
import TextLink from './TextLink'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env

function HomeGearPicks () {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  const scrollButtons = [
    {
      direction: -1,
      label: '向左瀏覽商品',
      iconClass:
        'rotate-180 motion-safe:group-hover:-translate-x-1 motion-safe:group-focus-visible:-translate-x-1'
    },
    {
      direction: 1,
      label: '向右瀏覽商品',
      iconClass:
        'motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1'
    }
  ]

  useEffect(() => {
    // 建立取消控制器，用來在離開元件時取消這次 API 請求
    const controller = new AbortController()

    // 定義非同步函式，處理 API 請求
    // useEffect 本身的回呼不直接寫成 async
    async function getProducts () {
      try {
        // 發送 GET 請求，等待 API 回傳商品資料
        const response = await axios.get(
          `${VITE_API_URL}/v2/api/${VITE_API_PATH}/products`,
          {
            // 將這次請求連接到取消控制器
            signal: controller.signal
          }
        )

        // 即使 HTTP 請求成功，API 仍可能回報操作失敗
        // 主動拋出錯誤，交給下面的 catch 處理
        if (response.data.success === false) {
          throw new Error('商品載入失敗')
        }

        // 將商品資料存入 state，讓 React 更新畫面
        // ?? []：資料為 null 或 undefined 時，改用空陣列
        setProducts(response.data.products ?? [])
      } catch (error) {
        // 接住網路錯誤、HTTP 錯誤，或上方主動拋出的錯誤
        // 如果只是離開元件而取消請求，就不顯示錯誤訊息
        if (!controller.signal.aborted) {
          setError('商品暫時無法載入，請稍後重新整理頁面。')
        }
      } finally {
        // 不論成功或失敗，最後都會執行 finally
        // 若請求未被取消，就結束「載入中」狀態
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    getProducts()

    // 清理函式：元件卸載或這次 effect 被清理時，取消請求
    return () => controller.abort()
  }, [])

  // direction 是捲動方向：
  // -1 向左，1 向右
  const scrollProducts = direction => {
    // 取得 ref={listRef} 所綁定的實際 <ul> DOM 元素
    const list = listRef.current

    // 列表尚未出現在畫面上時，停止執行
    if (!list) return

    // 檢查使用者是否在系統中設定「減少動態效果」
    // matches 會回傳 true 或 false
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // 從目前位置開始，捲動指定的距離
    list.scrollBy({
      // clientWidth：列表目前可視區域的寬度
      // 乘上 direction，決定向左或向右捲動約一個畫面
      left: direction * list.clientWidth,

      // 減少動態效果：立即移動
      // 一般情況：平滑捲動
      behavior: reduceMotion ? 'instant' : 'smooth'
    })
  }

  // 載入完成、沒有錯誤，而且有商品時才顯示。
  const showProducts = !loading && !error && products.length > 0

  return (
    <>
      <div className='mb-6 flex items-center justify-between gap-4'>
        <div className='featured-heading'>
          <h2 id='products-title'>精選商品</h2>
          <p lang='en'>GEAR PICKS</p>
        </div>
        {showProducts && (
          <div className='featured-controls'>
            {scrollButtons.map(button => (
              <button
                key={button.direction}
                type='button'
                className='group inline-flex shrink-0 items-center justify-center
                  rounded-sm size-[42px] border border-brand px-3 text-brand
                  bg-paper/20 backdrop-blur-xs transition-colors duration-200 cursor-pointer
                  hover:bg-brand hover:text-white focus-visible:bg-brand focus-visible:text-white'
                onClick={() => scrollProducts(button.direction)}
                aria-label={button.label}
                aria-controls='featured-product-list'
              >
                <ArrowIcon
                  className={`h-5 w-5 stroke-2
                    motion-safe:transition-transform motion-safe:duration-200
                    ${button.iconClass}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && <p role='status'>商品載入中…</p>}
      {error && <p role='alert'>{error}</p>}

      {!loading && !error && products.length === 0 && <p>目前沒有商品。</p>}

      {showProducts && (
        <ul
          id='featured-product-list'
          className='featured-track'
          ref={listRef}
          tabIndex={0}
          aria-label='精選商品列表，可左右捲動'
        >
          {products.map(product => (
            <li key={product.id} className='featured-item'>
              <Link to={`/products/${product.id}`} className='featured-card'>
                <div className='featured-image'>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt='' loading='lazy' />
                  ) : (
                    <span>尚無商品圖片</span>
                  )}
                </div>

                <div className='featured-info'>
                  <p className='featured-category'>{product.category}</p>

                  <h3>{product.title}</h3>

                  <div className='featured-prices'>
                    <p className='featured-price'>
                      NT$ {Number(product.price ?? 0).toLocaleString('zh-TW')}
                    </p>

                    {Number(product.origin_price) > Number(product.price) && (
                      <del className='featured-original-price'>
                        <span className='sr-only'>原價：</span>
                        NT${' '}
                        {Number(product.origin_price).toLocaleString('zh-TW')}
                      </del>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className='mt-8 text-right'>
        <TextLink to='/products'>查看所有商品</TextLink>
      </div>
    </>
  )
}

export default HomeGearPicks

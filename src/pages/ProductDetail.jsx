import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import ArrowIcon from '../components/icons/ArrowIcon'
import CartIcon from '../components/icons/CartIcon'
import './ProductDetail.css'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env

const formatPrice = (price) => Number(price ?? 0).toLocaleString('zh-TW')

function ProductDetail () {
  // 商品資料與頁面互動狀態：圖片、數量、分頁及購物車回饋。
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState(null)
  const recommendationRef = useRef(null)

  // 依網址中的商品 ID 載入詳情與同分類推薦；清理時取消未完成的請求。
  useEffect(() => {
    const controller = new AbortController()

    async function loadProduct () {
      setLoading(true)
      setError('')
      setProduct(null)
      setRecommendations([])
      setActiveImage(0)
      setQuantity(1)
      setCartMessage(null)
      window.scrollTo({ top: 0, behavior: 'instant' })

      try {
        const [productResponse, listResponse] = await Promise.all([
          axios.get(
            `${VITE_API_URL}/v2/api/${VITE_API_PATH}/product/${id}`,
            { signal: controller.signal }
          ),
          axios.get(
            `${VITE_API_URL}/v2/api/${VITE_API_PATH}/products`,
            { params: { page: 1 }, signal: controller.signal }
          ).catch(() => null)
        ])

        if (!productResponse.data.success || !productResponse.data.product) {
          throw new Error('Product not found')
        }

        if (!controller.signal.aborted) {
          const currentProduct = productResponse.data.product
          setProduct(currentProduct)

          // 商品列表可能分頁，載入其他頁後排除目前商品，只保留同分類品項。
          if (listResponse?.data?.success && Array.isArray(listResponse.data.products)) {
            const products = [...listResponse.data.products]
            const totalPages = Number(listResponse.data.pagination?.total_pages) || 1
            const pageRequests = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
              axios.get(
                `${VITE_API_URL}/v2/api/${VITE_API_PATH}/products`,
                { params: { page: index + 2 }, signal: controller.signal }
              ).then((response) => response.data.success && Array.isArray(response.data.products)
                ? response.data.products
                : [])
                .catch(() => [])
            )

            const remainingPages = await Promise.all(pageRequests)
            if (!controller.signal.aborted) {
              setRecommendations(
                [...products, ...remainingPages.flat()].filter((item) =>
                  String(item.id) !== String(currentProduct.id) &&
                  currentProduct.category &&
                  item.category === currentProduct.category
                )
              )
            }
          }
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('商品暫時無法載入，請稍後再試。')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadProduct()
    return () => controller.abort()
  }, [id])

  // 合併封面與相簿圖片，去除重複或空白網址。
  const images = useMemo(() => {
    if (!product) return []
    return [...new Set([product.imageUrl, ...(Array.isArray(product.imagesUrl) ? product.imagesUrl : [])]
      .filter((url) => typeof url === 'string' && url.trim()))]
  }, [product])

  // 將目前選取的商品數量送到購物車，並顯示成功或失敗訊息。
  const addToCart = async () => {
    if (!product || addingToCart) return
    setAddingToCart(true)
    setCartMessage(null)

    try {
      const response = await axios.post(
        `${VITE_API_URL}/v2/api/${VITE_API_PATH}/cart`,
        { data: { product_id: product.id, qty: quantity } }
      )
      if (!response.data.success) throw new Error('Add to cart failed')
      setCartMessage({ type: 'success', text: `已將 ${quantity} 件商品加入購物車。` })
    } catch {
      setCartMessage({ type: 'error', text: '加入購物車失敗，請稍後再試。' })
    } finally {
      setAddingToCart(false)
    }
  }

  const scrollRecommendations = (direction) => {
    recommendationRef.current?.scrollBy({
      left: direction * recommendationRef.current.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth'
    })
  }

  // 支援分頁標籤的方向鍵，以及 Home／End 快速切換。
  const handleTabKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextTab = event.key === 'Home'
      ? 'description'
      : event.key === 'End'
        ? 'content'
        : event.key === 'ArrowRight'
          ? 'content'
          : 'description'
    setActiveTab(nextTab)
    document.getElementById(`product-${nextTab}-tab`)?.focus()
  }

  return (
    <div className='product-detail-page'>
      {/* 頁首與麵包屑導覽 */}
      <header className='products-banner'>
        <div className='site-container'>
          <h1>
            精選商品
            <span lang='en'>GEAR PICKS</span>
          </h1>
        </div>
      </header>

      <div className='site-container product-detail-container'>
        <nav aria-label='麵包屑' className='product-detail-breadcrumb'>
          <ol>
            <li><Link to='/'>首頁</Link></li>
            <li><Link to='/products'>全部精選商品</Link></li>
            {product?.category && <li>{product.category}</li>}
            {product?.title && <li aria-current='page'>{product.title}</li>}
          </ol>
        </nav>

        {/* 依載入狀態顯示提示；取得資料後才呈現商品詳情。 */}
        {loading && <p role='status' className='product-detail-message'>商品載入中…</p>}

        {!loading && error && (
          <div role='alert' className='product-detail-message'>
            <p>{error}</p>
            <Link to='/products' className='product-detail-back-link'>返回商品列表</Link>
          </div>
        )}

        {!loading && !error && product && (
          <>
            {/* 商品相簿、價格、購買操作，以及商品描述分頁。 */}
            <section className='product-detail-main' aria-labelledby='product-title'>
              <div className='product-gallery'>
                <div className='product-gallery-thumbnails' role='group' aria-label='商品圖片'>
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type='button'
                      className={`product-thumbnail ${activeImage === index ? 'is-active' : ''}`}
                      onClick={() => setActiveImage(index)}
                      aria-label={`查看商品圖片 ${index + 1}`}
                      aria-pressed={activeImage === index}
                    >
                      <img src={image} alt='' loading='lazy' />
                    </button>
                  ))}
                </div>

                <div className='product-gallery-featured'>
                  {images.length > 0 ? (
                    <img
                      src={images[activeImage] ?? images[0]}
                      alt={product.title}
                      fetchPriority='high'
                    />
                  ) : (
                    <div className='product-gallery-empty'>尚無商品圖片</div>
                  )}
                </div>
              </div>

              <div className='product-detail-info'>
                <p className='product-detail-category'>{product.category}</p>
                <h2 id='product-title'>{product.title}</h2>

                <div className='product-detail-prices'>
                  <p className='product-detail-price'>NT$ {formatPrice(product.price)}</p>
                  {Number(product.origin_price) > Number(product.price) && (
                    <p className='product-detail-original'>
                      原價 <del>NT$ {formatPrice(product.origin_price)}</del>
                    </p>
                  )}
                </div>

                <div className='product-detail-purchase'>
                  <div className='product-quantity'>
                    <span id='product-quantity-label'>數量</span>
                    <div className='product-quantity-controls' aria-labelledby='product-quantity-label'>
                      <button
                        type='button'
                        aria-label='減少數量'
                        onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                        disabled={quantity <= 1 || addingToCart}
                      >
                        <Minus aria-hidden='true' />
                      </button>
                      <output aria-live='polite'>{quantity}</output>
                      <button
                        type='button'
                        aria-label='增加數量'
                        onClick={() => setQuantity((current) => current + 1)}
                        disabled={addingToCart}
                      >
                        <Plus aria-hidden='true' />
                      </button>
                    </div>
                  </div>

                  <button
                    type='button'
                    className='product-add-to-cart'
                    onClick={addToCart}
                    disabled={addingToCart}
                  >
                    <CartIcon aria-hidden='true' />
                    {addingToCart ? '加入中…' : '加入購物車'}
                  </button>
                  {cartMessage && (
                    <p role={cartMessage.type === 'error' ? 'alert' : 'status'} className={`product-cart-feedback is-${cartMessage.type}`}>
                      {cartMessage.text}
                      {cartMessage.type === 'success' && <Link to='/cart'>前往購物車</Link>}
                    </p>
                  )}
                </div>

                <div className='product-detail-tabs'>
                  <div
                    className='product-detail-tab-list'
                    role='tablist'
                    aria-label='商品資訊'
                    onKeyDown={handleTabKeyDown}
                  >
                    <button
                      id='product-description-tab'
                      type='button'
                      role='tab'
                      aria-selected={activeTab === 'description'}
                      aria-controls='product-description-panel'
                      onClick={() => setActiveTab('description')}
                    >商品描述</button>
                    <button
                      id='product-content-tab'
                      type='button'
                      role='tab'
                      aria-selected={activeTab === 'content'}
                      aria-controls='product-content-panel'
                      onClick={() => setActiveTab('content')}
                    >商品詳細內容</button>
                  </div>
                  <div
                    id='product-description-panel'
                    role='tabpanel'
                    aria-labelledby='product-description-tab'
                    hidden={activeTab !== 'description'}
                    tabIndex={0}
                  >
                    <p>{product.description || '目前尚無商品描述。'}</p>
                  </div>
                  <div
                    id='product-content-panel'
                    role='tabpanel'
                    aria-labelledby='product-content-tab'
                    hidden={activeTab !== 'content'}
                    tabIndex={0}
                  >
                    <p>{product.content || '目前尚無詳細內容。'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 只在有同分類商品時顯示推薦清單。 */}
            {recommendations.length > 0 && (
              <section className='product-recommendations' aria-labelledby='recommendations-title'>
                <div className='product-recommendations-heading'>
                  <h2 id='recommendations-title'>
                    你可能也喜歡 <span lang='en'>YOU MIGHT ALSO LIKE</span>
                  </h2>
                  {recommendations.length >= 6 && (
                    <div className='product-recommendation-controls'>
                      <button type='button' aria-label='向左瀏覽推薦商品' onClick={() => scrollRecommendations(-1)}>
                        <ArrowIcon aria-hidden='true' />
                      </button>
                      <button type='button' aria-label='向右瀏覽推薦商品' onClick={() => scrollRecommendations(1)}>
                        <ArrowIcon aria-hidden='true' />
                      </button>
                    </div>
                  )}
                </div>
                <ul
                  className={`product-recommendation-list ${recommendations.length >= 6 ? 'is-carousel' : 'is-static'}`}
                  ref={recommendationRef}
                >
                  {recommendations.map((item) => (
                    <li key={item.id}>
                      <Link to={`/products/${item.id}`} className='product-recommendation-card'>
                        <div className='product-recommendation-image'>
                          {item.imageUrl
                            ? <img src={item.imageUrl} alt='' loading='lazy' />
                            : <span>尚無商品圖片</span>}
                        </div>
                        <div className='product-recommendation-info'>
                          <h3>{item.title}</h3>
                          <div>
                            <span>NT$ {formatPrice(item.price)}</span>
                            {Number(item.origin_price) > Number(item.price) && (
                              <del>NT$ {formatPrice(item.origin_price)}</del>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className='product-recommendations-all'>
                  <Link to='/products'>查看所有商品 <ArrowIcon aria-hidden='true' /></Link>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductDetail

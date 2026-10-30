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
          setProduct(productResponse.data.product)
          const products = listResponse?.data?.products ?? []
          setRecommendations(
            products.filter((item) => String(item.id) !== String(id)).slice(0, 5)
          )
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

  const images = useMemo(() => {
    if (!product) return []
    return [...new Set([product.imageUrl, ...(Array.isArray(product.imagesUrl) ? product.imagesUrl : [])]
      .filter((url) => typeof url === 'string' && url.trim()))]
  }, [product])

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

        {loading && <p role='status' className='product-detail-message'>商品載入中…</p>}

        {!loading && error && (
          <div role='alert' className='product-detail-message'>
            <p>{error}</p>
            <Link to='/products' className='product-detail-back-link'>返回商品列表</Link>
          </div>
        )}

        {!loading && !error && product && (
          <>
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

            {recommendations.length > 0 && (
              <section className='product-recommendations' aria-labelledby='recommendations-title'>
                <div className='product-recommendations-heading'>
                  <h2 id='recommendations-title'>
                    你可能也喜歡 <span lang='en'>YOU MIGHT ALSO LIKE</span>
                  </h2>
                  <div className='product-recommendation-controls'>
                    <button type='button' aria-label='向左瀏覽推薦商品' onClick={() => scrollRecommendations(-1)}>
                      <ArrowIcon aria-hidden='true' />
                    </button>
                    <button type='button' aria-label='向右瀏覽推薦商品' onClick={() => scrollRecommendations(1)}>
                      <ArrowIcon aria-hidden='true' />
                    </button>
                  </div>
                </div>
                <ul className='product-recommendation-list' ref={recommendationRef}>
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

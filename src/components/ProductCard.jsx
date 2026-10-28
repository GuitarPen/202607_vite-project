import { Link } from 'react-router-dom'
import './ProductCard.css'
import CartIcon from './icons/CartIcon'

function ProductCard ({ product }) {
  return (
    <>
      <article className='product-card'>
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
                  NT$ {Number(product.origin_price).toLocaleString('zh-TW')}
                </del>
              )}
            </div>
          </div>
        </Link>
        <button type='button' className='product-card-cart' aria-label={`將 ${product.title} 加入購物車`} title='加入購物車'>
          <CartIcon className='product-card-cart-icon' />
        </button>
      </article>
    </>
  )
}

export default ProductCard

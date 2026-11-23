
import PageStatus from '../components/PageStatus'

function Cart () {
  return (
    <PageStatus
      variant='cart'
      status='購物功能準備中'
      eyebrow='CART · GETTING READY'
      title='購物車正在整裝中。'
      description='我們正在準備購物與結帳流程。這個頁面目前還不能顯示購物車內容或完成訂單；你可以先瀏覽已上架的旅途裝備。'
      primaryAction={{ to: '/products', label: '先看看商品' }}
      secondaryAction={{ to: '/', label: '回到首頁' }}
    />
  )
}

export default Cart

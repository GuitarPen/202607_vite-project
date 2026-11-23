
import PageStatus from '../components/PageStatus'

function NotFound () {
  return (
    <PageStatus
      variant='notFound'
      status='路線重新規劃'
      eyebrow='404 · OFF THE ROAD'
      title='咦，這條路線好像走偏了。'
      description='你要找的頁面不存在，或網址已經變更。回到首頁重新出發，或直接看看為旅程挑選的裝備。'
      primaryAction={{ to: '/', label: '回到首頁' }}
      secondaryAction={{ to: '/products', label: '瀏覽商品' }}
    />
  )
}

export default NotFound

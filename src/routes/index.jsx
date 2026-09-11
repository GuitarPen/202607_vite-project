import Layout from '../Layout'
import Home from '../pages/Home'
import Products from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import NotFound from '../pages/NotFound'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminOrders from '../pages/admin/AdminOrders'
import AdminLogin from '../pages/admin/AdminLogin'

const routes = [
  // 前台路由 → 共用 Layout（有 Navbar + Footer）
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'about',
        element: <div>關於我們</div>
      },
      {
        path: 'article',
        element: <div>文章</div>
      },
      {
        path: 'products',
        element: <Products />
      },
      {
        path: 'products/:id',
        element: <ProductDetail />
      },
      {
        path: 'cart',
        element: <Cart />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  // 後台登入 → 獨立頁面，不套 AdminLayout
  {
    path: '/admin/AdminLogin',
    element: <AdminLogin />
  },
  // 後台路由 → 獨立的 AdminLayout（不共用前台 Navbar）
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      // 預設顯示商品管理
      {
        path: '',
        element: <AdminProducts />
      },
      {
        path: 'orders',
        element: <AdminOrders />
      }
    ]
  }
]

export default routes

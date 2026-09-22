import Layout from '../Layout'
import Home from '../pages/Home'
import About from '../pages/About'
import Products from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import Articles from '../pages/Articles'
import ArticlesDetail from '../pages/ArticlesDetail'
import Cart from '../pages/Cart'
import NotFound from '../pages/NotFound'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminProducts from '../pages/admin/AdminProducts'
import AdminOrders from '../pages/admin/AdminOrders'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminArticles from '../pages/admin/AdminArticles'

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
        element: <About />
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
        path: 'articles',
        element: <Articles />
      },
      {
        path: 'articles/:id',
        element: <ArticlesDetail />
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
      },
      {
        path: 'articles',
        element: <AdminArticles />
      }
    ]
  }
]

export default routes

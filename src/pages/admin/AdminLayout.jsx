import axios from 'axios'
import { useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

const { VITE_API_URL } = import.meta.env

function AdminLayout() {
    const navigate = useNavigate()

    useEffect(() => {
        // 從 Cookie 取出 Token
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
            '$1'
        )

        // 設定 axios 預設帶上 Token
        axios.defaults.headers.common['Authorization'] = token

        // 驗證 Token 是否有效
        const checkLogin = async () => {
            try {
                await axios.post(`${VITE_API_URL}/v2/api/user/check`)
                // 驗證成功 → 留在後台，不做任何事
            } catch (error) {
                // 驗證失敗 → 跳回登入頁
                alert('請先登入')
                navigate('/admin/login')
            }
        }

        checkLogin()
    }, [navigate])

    return (
        <div>
            <nav className="flex gap-4 p-4 bg-gray-800 text-white">
                <span className="font-bold">後台管理</span>
                <Link to="/" className="hover:text-gray-300">回前台</Link>
                <Link to="/admin" className="hover:text-gray-300">Products</Link>
                <Link to="/admin/orders" className="hover:text-gray-300">Orders</Link>
            </nav>
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
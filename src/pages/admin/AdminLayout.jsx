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
        console.log('Token:', token)  // ← 加這行

        // Token 是空的 → 直接跳登入頁
        if (!token) {
            alert('請先登入')
            navigate('/admin/AdminLogin')
            return
        }

        // 設定 axios 預設帶上 Token
        axios.defaults.headers.common['Authorization'] = token

        // 驗證 Token 是否有效
        const checkLogin = async () => {
            try {
                await axios.post(`${VITE_API_URL}/v2/api/user/check`)
                console.log('驗證成功')
                // 驗證成功 → 留在後台，不做任何事
            } catch (error) {
                // 驗證失敗 → 跳回登入頁
                console.log('驗證失敗', error)  // ← 加這行
                alert('請先登入')
                navigate('/admin/AdminLogin')
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
                <Link to="/admin/articles" className="hover:text-gray-300">Articles</Link>
            </nav>
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
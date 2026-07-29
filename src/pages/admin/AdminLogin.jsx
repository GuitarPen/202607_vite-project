import axios from 'axios'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const { VITE_API_URL } = import.meta.env

function AdminLogin() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${VITE_API_URL}/v2/admin/signin`, formData)
            const { token, expired } = res.data
            // 存 Token 到 Cookie
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`
            // 導向後台
            navigate('/admin')
        } catch (error) {
            alert('登入失敗，請確認帳號密碼')
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <h1 className="text-2xl font-bold text-center">後台登入</h1>
                <input
                    type="email"
                    name="username"
                    placeholder="Email"
                    value={formData.username}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="密碼"
                    value={formData.password}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    登入
                </button>
                <Link to="/" className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 text-center" >前台</Link>
            </form>
        </div>
    )
}

export default AdminLogin
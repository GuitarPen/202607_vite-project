import axios from 'axios'
import { useEffect, useState } from 'react'
import ProductModal from '../../components/ProductModal'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env

function AdminProducts() {
    const [products, setProducts] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState('create')
    const [selectedProduct, setSelectedProduct] = useState(null)

    // 取得商品列表
    const getProducts = async () => {
        try {
            const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
                '$1'
            )
            axios.defaults.headers.common['Authorization'] = token

            const res = await axios.get(
                `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin/products`
            )
            setProducts(res.data.products || []) // ← 加 || [] 保護
            console.log('取得商品列表成功', res.data.products)
        } catch (error) {
            alert('取得商品列表失敗')
            console.log('取得商品列表失敗')
        }
    }

    useEffect(() => {
        getProducts()
    }, [])

    // 開啟新增 Modal
    const handleOpenCreate = () => {
        setModalMode('create')
        setSelectedProduct(null)
        setIsModalOpen(true)
    }

    // 開啟編輯 Modal
    const handleOpenEdit = (product) => {
        setModalMode('edit')
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    // 刪除商品
    const handleDelete = async (id) => {
        if (!window.confirm('確定要刪除這個商品嗎？')) return
        try {
            await axios.delete(
                `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin/product/${id}`
            )
            alert('刪除成功')
            getProducts()
        } catch (error) {
            alert('刪除失敗')
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">商品管理</h1>
                <button
                    onClick={handleOpenCreate}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    新增商品
                </button>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">商品名稱</th>
                        <th className="border p-2 text-left">分類</th>
                        <th className="border p-2 text-left">原價</th>
                        <th className="border p-2 text-left">售價</th>
                        <th className="border p-2 text-left">是否啟用</th>
                        <th className="border p-2 text-left">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="border p-2">{product.title}</td>
                            <td className="border p-2">{product.category}</td>
                            <td className="border p-2">{product.origin_price}</td>
                            <td className="border p-2">{product.price}</td>
                            <td className="border p-2">
                                <span className={product.is_enabled ? 'text-green-500' : 'text-red-500'}>
                                    {product.is_enabled ? '啟用' : '未啟用'}
                                </span>
                            </td>
                            <td className="border p-2 flex gap-2">
                                <button
                                    onClick={() => handleOpenEdit(product)}
                                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                                >
                                    編輯
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    刪除
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
                product={selectedProduct}
                onSuccess={getProducts}
            />
        </div>
    )
}

export default AdminProducts
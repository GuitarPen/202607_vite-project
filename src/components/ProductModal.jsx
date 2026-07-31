import axios from 'axios'
import { useEffect, useState } from 'react'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env

const defaultForm = {
    title: '',
    category: '',
    origin_price: '',
    price: '',
    description: '',
    content: '',
    unit: '',
    imageUrl: '',
    is_enabled: 1,
}

function ProductModal({ isOpen, onClose, mode, product, onSuccess }) {
    const [formData, setFormData] = useState(defaultForm)

    // 編輯模式時帶入商品資料，新增模式時清空
    useEffect(() => {
        if (mode === 'edit' && product) {
            setFormData(product)
        } else {
            setFormData(defaultForm)
        }
    }, [mode, product])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const submitData = {
                ...formData,
                origin_price: Number(formData.origin_price),
                price: Number(formData.price),
            }

            if (mode === 'create') {
                await axios.post(
                    `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin/product`,
                    { data: submitData }  // ← 改成 submitData
                )
                alert('新增成功')
            } else {
                await axios.put(
                    `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin/product/${product.id}`,
                    { data: submitData }  // ← 改成 submitData
                )
                alert('修改成功')
            }
            onSuccess()
            onClose()
        } catch (error) {
            alert(mode === 'create' ? '新增失敗' : '修改失敗')
        }
    }

    if (!isOpen) return null

    return (
        // 背景遮罩
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal 主體 */}
            <div className="bg-white rounded-lg w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {mode === 'create' ? '新增商品' : '修改商品'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">商品名稱</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">分類</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">原價</label>
                            <input
                                type="number"
                                name="origin_price"
                                value={formData.origin_price}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">售價</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">單位</label>
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">商品描述</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">圖片網址</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                        {/* 圖片預覽 */}
                        <div className="mt-2 border rounded overflow-hidden h-48 flex items-center justify-center bg-gray-50">
                            {formData.imageUrl ? (
                                <img
                                    src={formData.imageUrl}
                                    alt="商品預覽"
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <p className="text-gray-400 text-sm">輸入圖片網址後顯示預覽</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_enabled"
                            id="is_enabled"
                            checked={formData.is_enabled === 1}
                            onChange={(e) =>
                                setFormData({ ...formData, is_enabled: e.target.checked ? 1 : 0 })
                            }
                        />
                        <label htmlFor="is_enabled" className="text-sm">是否啟用</label>
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {mode === 'create' ? '新增' : '儲存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductModal
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

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
    const [saving, setSaving] = useState(false)
    const dialogRef = useRef(null)

    // 與文章彈窗相同：開啟 dialog，並鎖定背景捲動
    useEffect(() => {
        if (!isOpen) return
        const dialog = dialogRef.current
        const previousOverflow = document.body.style.overflow
        if (!dialog.open) dialog.showModal()
        document.body.style.overflow = 'hidden'

        return () => {
            dialog.close()
            document.body.style.overflow = previousOverflow
        }
    }, [isOpen])

    const handleClose = () => {
        if (!saving) onClose()
    }

    // 編輯模式時帶入商品資料，新增模式時清空
    useEffect(() => {
        if (mode === 'edit' && product) {
            setFormData(product)
        } else {
            setFormData(defaultForm)
        }
    }, [isOpen, mode, product])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (saving) return
        setSaving(true)
        try {
            const submitData = {
                ...formData,
                origin_price: Number(formData.origin_price),
                price: Number(formData.price),
            }

            let response

            if (mode === 'create') {
                response = await axios.post(
                    `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin/product`,
                    { data: submitData }  // ← 改成 submitData
                )
            } else {
                response = await axios.put(
                    `${VITE_API_URL}/v2/api/${VITE_API_PATH}/admin/product/${product.id}`,
                    { data: submitData }  // ← 改成 submitData
                )
            }
            if (!response.data.success) throw new Error('儲存失敗')
        } catch {
            setSaving(false)
            alert(mode === 'create' ? '新增失敗' : '修改失敗')
            return
        }

        setSaving(false)
        alert(mode === 'create' ? '新增成功' : '修改成功')
        onSuccess()
        onClose()
    }

    if (!isOpen) return null

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="product-modal-title"
            onCancel={event => {
                event.preventDefault()
                handleClose()
            }}
            className="fixed inset-0 m-auto
                max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl
                overflow-y-auto rounded-xl border-0
                bg-paper p-6 text-ink shadow-xl backdrop:bg-black/50"
        >
                <div className="mb-6 flex items-center justify-between gap-4">
                    <h2 id="product-modal-title" className="text-xl font-bold">
                        {mode === 'create' ? '新增商品' : '編輯商品'}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={saving}
                        aria-label="關閉商品編輯視窗"
                        className="inline-flex size-10 shrink-0 items-center justify-center
                            rounded hover:bg-sand disabled:opacity-50"
                    >
                        <span aria-hidden="true">✕</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} aria-busy={saving}>
                  <fieldset disabled={saving} className="space-y-4">
                    <div>
                        <label htmlFor="product-title" className="mb-1 block">商品名稱</label>
                        <input
                            type="text"
                            id="product-title" name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="product-category" className="mb-1 block">分類</label>
                        <input
                            type="text"
                            id="product-category" name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="min-w-0 flex-1">
                            <label htmlFor="product-origin_price" className="mb-1 block">原價</label>
                            <input
                                type="number"
                                id="product-origin_price" name="origin_price"
                                value={formData.origin_price}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <label htmlFor="product-price" className="mb-1 block">售價</label>
                            <input
                                type="number"
                                id="product-price" name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="product-unit" className="mb-1 block">單位</label>
                        <input
                            type="text"
                            id="product-unit" name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="product-description" className="mb-1 block">商品描述</label>
                        <textarea
                            id="product-description" name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-input"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label htmlFor="product-imageUrl" className="mb-1 block">圖片網址</label>
                        <input
                            type="text"
                            id="product-imageUrl" name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="form-input"
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

                    <div className="flex justify-end gap-3 border-t border-sand pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded border px-4 py-2 hover:bg-sand disabled:opacity-50"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-brand px-4 py-2 text-white disabled:opacity-50"
                        >
                            {saving ? '儲存中…' : mode === 'create' ? '新增商品' : '儲存變更'}
                        </button>
                    </div>
                  </fieldset>
                </form>
        </dialog>
    )
}

export default ProductModal

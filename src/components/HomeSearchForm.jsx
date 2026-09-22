function HomeSearchForm () {
  const handleSearch = event => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const keyword = String(formData.get('keyword') ?? '').trim()

    // 取得這次觸發表單送出的按鈕
    const searchType = event.nativeEvent.submitter?.value ?? 'products'

    if (!keyword) return

    if (searchType === 'products') {
      console.log('搜尋商品：', keyword)
    } else {
      console.log('搜尋文章：', keyword)
    }
  }

  const searchButtons = [
    {
      value: 'products',
      label: '開始選購',
      colorClass:
        'border-brand bg-brand hover:brightness-110 focus-visible:outline-brand'
    },
    {
      value: 'articles',
      label: '探索路線',
      colorClass:
        'border-ink bg-ink hover:brightness-125 focus-visible:outline-ink'
    }
  ]

  return (
    <form onSubmit={handleSearch} role='search' className='mt-6'>
      <label htmlFor='hero-search' className='sr-only'>
        搜尋商品或旅行文章
      </label>

      <input
        id='hero-search'
        name='keyword'
        type='search'
        placeholder='輸入關鍵字後，選擇搜尋裝備或旅行文章'
        required
        className='form-input h-15 border-transparent shadow-card'
      />

      <div className='mt-4 grid grid-cols-2 gap-3'>
        {searchButtons.map(item => (
          <button
            key={item.value}
            type='submit'
            name='searchType'
            value={item.value}
            className={`min-w-0 cursor-pointer rounded border
              px-6 py-1.5 text-white
              hover:shadow-md
              motion-safe:transition motion-safe:duration-200
              motion-safe:hover:-translate-y-0.5
              motion-safe:active:translate-y-0
              motion-safe:active:scale-[0.98]
              focus-visible:outline-2 focus-visible:outline-offset-2
              ${item.colorClass}`}
          >
            {item.label}
          </button>
        ))}
      </div>

    </form>
  )
}

export default HomeSearchForm

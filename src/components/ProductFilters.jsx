// 父層傳入分類、目前選擇，以及修改分類的函式。
function ProductFilters (props) {
  // 品牌篩選目前只呈現介面，不會影響商品列表。
  const brands = ['山嶺選物', '森野裝備', '野行者', '遠途工坊', '營地製造']

  return (
    <div className='product-filters'>
      {/* 分類 */}
      <fieldset className='product-filter-group' disabled={props.disabled}>
        <legend>分類</legend>
        <label className='product-filter-option'>
          <input
            type='radio'
            name='product-category'
            checked={props.selectedCategory === ''}
            onChange={() => props.onChange('')}
          />
          <span>全部商品</span>
        </label>

        {props.categories.map((category) => (
          <label key={category} className='product-filter-option'>
            <input
              type='radio'
              name='product-category'
              checked={props.selectedCategory === category}
              onChange={() => props.onChange(category)}
            />
            <span>{category}</span>
          </label>
        ))}
      </fieldset>

      {/* 品牌 */}
      <fieldset className='product-filter-group product-filter-brands'>
        <legend>品牌</legend>
        {brands.map((brand) => (
          <label key={brand} className='product-filter-option'>
            <input type='checkbox' name='product-brand' value={brand} />
            <span>{brand}</span>
          </label>
        ))}
      </fieldset>

      <button
        type='button'
        className='product-filter-clear'
        onClick={() => props.onChange('')}
        disabled={props.disabled || props.selectedCategory === ''}
      >
        清除篩選
      </button>
    </div>
  )
}

export default ProductFilters

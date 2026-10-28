// 父層傳入分類、目前選擇，以及修改分類的函式。
function ProductFilters (props) {
  return (
    <div className='product-filters'>
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

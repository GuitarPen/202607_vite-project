import ArrowIcon from './icons/ArrowIcon'

function NewsletterForm () {
  const handleSubmit = event => {
    event.preventDefault()
    // 後續在這裡處理電子報訂閱
  }

  return (
    <form className='mt-4' onSubmit={handleSubmit}>
      <label htmlFor='newsletter-email' className='sr-only'>
        電子郵件
      </label>

      <div className='flex items-stretch gap-2'>
        <input
          id='newsletter-email'
          name='email'
          type='email'
          placeholder='輸入你的 Email'
          autoComplete='email'
          required
          className='form-input flex-1 text-base border-[#D7D3C9]'
        />

        <button
          type='submit'
          aria-label='訂閱電子報'
          title='訂閱電子報'
          className='
            group inline-flex shrink-0 items-center justify-center
            rounded-sm border border-brand px-3 text-brand
            transition-colors duration-200 cursor-pointer
            hover:bg-brand hover:text-white
            focus-visible:bg-brand focus-visible:text-white
          '
        >
          <ArrowIcon
            className='
              h-5 w-5 stroke-2
              motion-safe:transition-transform motion-safe:duration-200
              motion-safe:group-hover:translate-x-1
              motion-safe:group-focus-visible:translate-x-1
            '
          />
        </button>
      </div>
    </form>
  )
}

export default NewsletterForm

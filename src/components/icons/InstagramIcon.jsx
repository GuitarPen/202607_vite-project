function InstagramIcon ({ className = 'size-10 stroke-1' }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      viewBox='0 0 24 24'
    >
      <path d='M0 0h24v24H0z' fill='none' />
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4m7.5 8a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0'
      />
    </svg>
  )
}

export default InstagramIcon

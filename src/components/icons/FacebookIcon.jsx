function FacebookIcon ({ className = 'size-10 stroke-1' }) {
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
        d='M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m0 0V10a2 2 0 0 1 2-2h1m-.5 4.5h-5'
      />
    </svg>
  )
}

export default FacebookIcon

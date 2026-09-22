function DashedDivider ({ className = '', dash = 8, gap = 6, thickness = 3 }) {
  return (
    <svg
      className={`block w-full ${className}`}
      height={thickness}
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
      focusable='false'
    >
      <line
        x1='0'
        y1={thickness / 2}
        x2='100%'
        y2={thickness / 2}
        stroke='currentColor'
        strokeWidth={thickness}
        strokeDasharray={`${dash} ${gap}`}
      />
    </svg>
  )
}

export default DashedDivider

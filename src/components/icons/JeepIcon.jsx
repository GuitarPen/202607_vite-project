import jeepBody from '../../assets/images/jeep-body.svg'
import jeepBottomTires from '../../assets/images/jeep-bottom-tires.svg'
import jeepRearTires from '../../assets/images/jeep-rear-tires.svg'
import './JeepIcon.css'

function JeepIcon ({ className = '' }) {
  return (
    <div className={`jeep ${className}`} aria-hidden='true'>
      {/* 車尾備胎，不旋轉 */}
      <img src={jeepRearTires} alt='' className='jeep-spare' />

      {/* 車身 */}
      <img src={jeepBody} alt='' className='jeep-body' />

      {/* 後輪 */}
      <img
        src={jeepBottomTires}
        alt=''
        className='jeep-wheel jeep-wheel-rear'
      />

      {/* 前輪 */}
      <img
        src={jeepBottomTires}
        alt=''
        className='jeep-wheel jeep-wheel-front'
      />
    </div>
  )
}

export default JeepIcon

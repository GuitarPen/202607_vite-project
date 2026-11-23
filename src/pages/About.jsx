
import PageStatus from '../components/PageStatus'

function About () {
  return (
    <PageStatus
      variant='story'
      status='品牌故事整理中'
      eyebrow='OUR STORY · IN THE MAKING'
      title='ROADKIT 的故事，正在整理上路。'
      description='我們正整理這個公路旅行選物品牌的起點、想去的地方，以及一路挑選裝備的理由。先逛逛旅途裝備，或讀幾篇旅行誌，和我們一起出發。'
      primaryAction={{ to: '/products', label: '逛逛旅途裝備' }}
      secondaryAction={{ to: '/articles', label: '閱讀旅行誌' }}
    />
  )
}

export default About

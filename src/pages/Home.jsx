import { Link } from 'react-router-dom'
import './Home.css'
import banner from '../assets/images/banner.jpg'
import bannerCar from '../assets/images/banner-car.png'
import CompassIcon from '../components/icons/CompassIcon'
import HomeSearchForm from '../components/HomeSearchForm'
import AboutUsImg from '../assets/images/AboutUs-img.jpg'
import aboutGearPicks from '../assets/images/AboutUs-gearPicks.jpg'
import aboutRoutes from '../assets/images/AboutUs-routes.jpg'
import aboutReviews from '../assets/images/AboutUs-reviews.jpg'
import categoryTent from '../assets/images/category_tent.svg'
import categoryBags from '../assets/images/category_bags.svg'
import categoryCamera from '../assets/images/category_camera.svg'
import categoryCar from '../assets/images/category_car.svg'
import DashedDivider from '../components/DashedDivider'
import FeaturedProducts from '../components/HomeGearPicks'
import TextLink from '../components/TextLink'

// 關於品牌
const aboutStats = [
  {
    label: '精選商品',
    english: 'GEAR PICKS',
    value: '300+',
    image: aboutGearPicks
  },
  {
    label: '旅行路線',
    english: 'ROUTES',
    value: '50+',
    image: aboutRoutes
  },
  {
    label: '旅人好評',
    english: 'REVIEWS',
    value: '100%',
    image: aboutReviews
  }
]

// 商品分類
const categories = [
  {
    id: 'camping',
    label: '露營裝備',
    image: categoryTent
  },
  {
    id: 'travel',
    label: '旅行小物',
    image: categoryBags
  },
  {
    id: 'photography',
    label: '攝影配件',
    image: categoryCamera
  },
  {
    id: 'car',
    label: '車用配件',
    image: categoryCar
  }
]

function Home () {
  return (
    <>
      {/* 1. 主視覺 */}
      <div className='hero-frame'>
        <section
          className='hero'
          style={{
            backgroundImage: `url("${banner}")`,
            backgroundPosition: 'bottom'
          }}
          aria-labelledby='hero-title'
        >
          <div className='site-container hero-content'>
            {/* 車子獨立於內容容器 */}
            <img src={bannerCar} alt='' className='hero-car' />
            <div className='hero-copy'>
              <div className='flex items-center gap-2 text-brand'>
                <CompassIcon className='h-6.25 w-6.25 shrink-0' />
                <span className='font-moderustic tracking-widest text-[24px]'>
                  ROAD TRIP ESSENTIALS
                </span>
              </div>
              <h1
                id='hero-title'
                className='mt-4 text-[40px] font-medium leading-tight'
              >
                裝備你的
                <br />
                每一段旅程
              </h1>
              <p className='mt-6 leading-normal text-xl text-paper'>
                從山林到海岸，我們為每一位旅人
                <br />
                精選最適合的公路旅行裝備。
              </p>

              {/* 搜尋欄位與搜尋按鈕 */}
              <HomeSearchForm />
            </div>
          </div>
        </section>
      </div>
      
      <div className='home-discovery'>
        {/* 2. 關於品牌 */}
        <section className='about' aria-labelledby='about-title'>
          <div className='site-container site-container--narrow about-layout'>
            <div className='about-content'>
              {/* 品牌文字區 */}
              <div className='about-copy'>
                <div className='about-title text-[28px] font-bold text-brand'>
                  <p className='font-playfair'>ABOUT US</p>

                  <h2 id='about-title'>我們相信，旅程本身就是目的地</h2>
                </div>
                <div className='mt-6 space-y-6 leading-relaxed text-ink'>
                  <p>
                    ROADKIT 誕生於一趟說走就走的公路旅行。
                    我們走過山林、穿越荒漠、沿著海岸線一路向前，
                    才明白一件好裝備能讓旅途走得更遠、更自在。
                  </p>
                  <p>
                    我們不賣你不需要的東西，
                    只精選真正陪得住每一段路的旅行夥伴。
                  </p>
                </div>
                <div className='my-3 flex justify-end'>
                  <TextLink to='/about'>了解我們的故事</TextLink>
                </div>
              </div>
              {/* 品牌圖片區 */}
              <img
                src={AboutUsImg}
                alt='品牌旅行故事'
                className='h-[230px] w-full rounded-xl object-cover object-[50%_70%]'
              />
            </div>

            <dl className='about-stats'>
              {aboutStats.map(stat => (
                <div
                  key={stat.english}
                  className='about-stat'
                  style={{ '--stat-image': `url("${stat.image}")` }}
                >
                  <dt>
                    <span>{stat.label}</span>
                    <span className='about-stat-english' lang='en'>
                      {stat.english}
                    </span>
                  </dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 3. 商品分類 */}
        <section className='categories' aria-labelledby='categories-title'>
          <DashedDivider
            className='text-sand-dark'
            dash={8}
            gap={8}
            thickness={3}
          />
          <div className='site-container site-container--narrow category-inner'>
            <div className='category-heading'>
              <h2 id='categories-title'>按類別瀏覽商品</h2>
              <p lang='en'>EXPLORE BY CATEGORY</p>
            </div>

            <ul className='category-list'>
              {categories.map(category => (
                <li key={category.id}>
                  <Link
                    to={`/products?category=${encodeURIComponent(
                      category.label
                    )}`}
                    className='category-card'
                  >
                    <img
                      src={category.image}
                      alt=''
                      className='category-icon'
                    />

                    <span className='category-name'>{category.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <DashedDivider
            className='text-sand-dark'
            dash={8}
            gap={8}
            thickness={3}
          />
        </section>

        {/* 4. 精選商品 */}
        <section className='featured-products' aria-labelledby='products-title'>
          <div className='site-container'>
            <FeaturedProducts />
          </div>
        </section>
      </div>

      {/* 5. 旅行誌 */}
      <section className='travel-log pb-24' aria-labelledby='travel-log-title'>
        <div className='container'>
          <h2 id='travel-log-title'>旅行誌 TRAVEL LOG</h2>

          <div className='travel-log-layout'>
            <article className='featured-article'>
              {/* 左側大文章：圖片、日期、標題、摘要、作者 */}
            </article>

            <div className='article-list'>
              <article className='article-card'>{/* 右上文章 */}</article>

              <article className='article-card'>{/* 右下文章 */}</article>
            </div>
          </div>

          <div className='section-actions'>{/* 查看所有文章 */}</div>
        </div>
      </section>
    </>
  )
}

export default Home

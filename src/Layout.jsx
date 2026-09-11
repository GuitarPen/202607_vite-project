import { Outlet, NavLink, Link } from 'react-router-dom'
import logo from './assets/images/roadkit-fisheye-logo_white.svg'
import footerLogo from './assets/images/roadkit-fisheye-logo_green.svg'
import CartIcon from './components/icons/CartIcon'
import PersonIcon from './components/icons/PersonIcon'
import FacebookIcon from './components/icons/FacebookIcon'
import InstagramIcon from './components/icons/InstagramIcon'
import shippingIcon from './assets/images/service_icon-01.svg'
import returnsIcon from './assets/images/service_icon-02.svg'
import supportIcon from './assets/images/service_icon-03.svg'
import NewsletterForm from './components/NewsletterForm'

function Layout () {
  const headerActions = [
    {
      id: 'cart',
      icon: <CartIcon />,
      label: '購物車',
      to: '/cart'
    },
    {
      id: 'member',
      icon: <PersonIcon />,
      label: '會員功能',
      to: '/member'
    }
  ]

  const services = [
    {
      id: 'shipping',
      icon: shippingIcon,
      title: '全台免運',
      description: '訂單滿千免運'
    },
    {
      id: 'returns',
      icon: returnsIcon,
      title: '30 天退換貨',
      description: '品質有問題免費退換'
    },
    {
      id: 'support',
      icon: supportIcon,
      title: '專人客服',
      description: '週一到週五 9:00–18:00'
    }
  ]

  const community = [
    {
      id: 'facebook',
      icon: <FacebookIcon className='size-10 stroke-1' />,
      url: 'https://www.facebook.com/'
    },
    {
      id: 'instagram',
      icon: <InstagramIcon className='size-10 stroke-1' />,
      url: 'https://www.instagram.com/'
    }
  ]

  const footerNavGroups = [
    {
      id: 'explore',
      title: '探索 ROADKIT',
      links: [
        { id: 'about', label: '關於我們', to: '/about' },
        { id: 'articles', label: '旅行文章', to: '/article' }
      ]
    },
    {
      id: 'shop',
      title: '選購',
      links: [{ id: 'products', label: '全部商品', to: '/products' }]
    },
    {
      id: 'support',
      title: '顧客服務',
      links: [
        { id: 'shopping-guide', label: '購物說明' },
        { id: 'shipping', label: '配送與退換貨' },
        { id: 'faq', label: '常見問題' },
        { id: 'contact', label: '聯絡我們' }
      ]
    }
  ]

  return (
    <>
      <header className='bg-brand text-white'>
        <div className='site-container flex flex-wrap items-center gap-10 py-5'>
          <Link
            to='/'
            title='ROADKIT 首頁'
            className='site-logo text-3xl font-black tracking-tight'
          >
            <img src={logo} alt='ROADKIT 首頁' className='h-12 w-auto' />
          </Link>

          <nav
            aria-label='主要導覽'
            className='ml-auto flex items-center gap-4 text-base md:gap-8'
          >
            {/* 關於我們、商品、文章 */}
            <NavLink to='/about'>關於我們</NavLink>
            <NavLink to='/products'>商品</NavLink>
            <NavLink to='/article'>文章</NavLink>
          </nav>

          <div className='flex items-center'>
            {/* 購物車連結、會員入口 */}
            {headerActions.map(action => (
              <Link
                key={action.id}
                to={action.to}
                aria-label={action.label}
                className='inline-flex h-8 w-8 items-center justify-center transition-colors hover:text-sand'
              >
                {action.icon}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <section
        className='service-benefits-bg bg-brand py-20 text-white'
        aria-label='購物服務特色'
      >
        <ul className='site-container grid grid-cols-1 gap-8 md:grid-cols-3'>
          {services.map(service => (
            <li
              key={service.id}
              className='flex items-center justify-center gap-4'
            >
              <img src={service.icon} alt='' className='h-25 w-25 shrink-0' />
              <div>
                <h2 className='font-medium text-xl'>{service.title}</h2>
                <p className='mt-2 text-base font-normal'>
                  {service.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className='bg-sand'>
        <div className='site-container py-12'>
          {/* footer-main */}
          <div className='grid grid-cols-1 gap-10 lg:grid-cols-4'>
            {/* 品牌資訊 */}
            <div className='text-brand'>
              <img
                src={footerLogo}
                alt='ROADKIT 首頁'
                className='h-24 w-auto'
              />
              <p className='mt-3 text-xl font-medium tracking-[0.15em]'>
                公路旅行生活選物
              </p>
              <p className='mt-5 ml-1 border-l-4 border-brand-grey text-brand-grey pl-3 text-base '>
                為每一段旅程，
                <br />
                挑選實用而有風格的裝備。
              </p>
              <ul className='mt-5 flex items-center gap-1'>
                {community.map(item => (
                  <li>
                    <a
                      href={item.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={`ROADKIT ${item.id}（另開分頁）`}
                      title={item.id}
                      className='
                        inline-flex h-10 w-10 items-center justify-center rounded-full
                        text-brand transition-colors
                        hover:bg-brand hover:text-sand
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-brand
                      '
                    >
                      {item.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 網站導覽 */}
            <nav
              className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-2'
              aria-label='頁尾導覽'
            >
              {footerNavGroups.map(group => (
                <div key={group.id}>
                  <h2 className='font-bold text-2xl text-brand'>
                    {group.title}
                  </h2>
                  <ul className='mt-4 flex flex-col gap-3 text-base font-medium'>
                    {group.links.map(link => (
                      <li key={link.id}>
                        {link.to ? (
                          <Link
                            to={link.to}
                            className='underline-offset-4 hover:underline'
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <span>{link.label}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {/* 電子報 */}
            <div className='newsletter'>
              <h2 className='font-bold text-2xl text-brand'>訂閱旅行電子報</h2>
              <p className='mt-3 text-base text-brand-grey'>
                第一手裝備情報 × 路線攻略
              </p>

              <NewsletterForm />
            </div>
          </div>

          {/* SVG 虛線分隔線 */}
          <svg
            width='100%'
            height='3'
            className='mt-10 block text-[#F8F5EE]'
            aria-hidden='true'
          >
            <line
              x1='0'
              y1='1'
              x2='100%'
              y2='1'
              stroke='currentColor'
              strokeWidth={3}
              strokeDasharray='8 8'
            />
          </svg>

          {/* 底部資訊 footer-bottom */}
          <div
            className='
              mt-10 flex flex-col gap-4 
              text-sm leading-relaxed
              md:flex-row md:items-center md:justify-between
            '
          >
            <p className='text-brand-grey'>本網站為作品集，僅用來學習，非商業用途。</p>
            <p>© 2026 ROADKIT. All rights reserved.</p>
            <Link to='/admin' className='text-brand-grey hover:underline underline-offset-4'>
              管理員登入
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Layout

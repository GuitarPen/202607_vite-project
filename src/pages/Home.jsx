
function Home() {
  return <>
    {/* 1. 主視覺 */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-content">
            <p>ROAD TRIP ESSENTIALS</p>

            <h1 id="hero-title">
              裝備你的
              <br />
              每一段旅程
            </h1>

            <p>
              從山林到海岸，我們為每一位旅人
              精選更適合的公路旅行裝備。
            </p>

            <form className="hero-search" role="search">
              {/* 搜尋欄位與搜尋按鈕 */}
            </form>

            <div className="hero-actions">
              {/* 開始選購、探索路線 */}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 關於品牌 */}
      <section className="about" aria-labelledby="about-title">
        <div className="container about-layout">
          <div className="about-content">
            <p>ABOUT US</p>
            <h2 id="about-title">
              我們相信，旅程本身就是目的地
            </h2>

            {/* 品牌介紹、故事連結、道路照片 */}
          </div>

          <dl className="about-stats">
            <div>
              <dt>精選商品</dt>
              <dd>300+</dd>
            </div>
            <div>
              <dt>旅行路線</dt>
              <dd>50+</dd>
            </div>
            <div>
              <dt>旅人好評</dt>
              <dd>100%</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 3. 商品分類 */}
      <section
        className="categories"
        aria-labelledby="categories-title"
      >
        <div className="container">
          <h2 id="categories-title">
            按類別瀏覽商品 EXPLORE BY CATEGORY
          </h2>

          <ul className="category-list">
            {/* 四個 li：露營裝備、旅行小物、攝影配件、車用配件 */}
          </ul>
        </div>
      </section>

      {/* 4. 精選商品 */}
      <section
        className="featured-products"
        aria-labelledby="products-title"
      >
        <div className="container">
          <h2 id="products-title">精選商品 GEAR PICKS</h2>

          <ul className="product-grid">
            {/* 四個 li，每個放一張商品卡片 */}
          </ul>

          <div className="section-actions">
            {/* 查看所有商品 */}
          </div>
        </div>
      </section>

      {/* 5. 旅行誌 */}
      <section
        className="travel-log"
        aria-labelledby="travel-log-title"
      >
        <div className="container">
          <h2 id="travel-log-title">旅行誌 TRAVEL LOG</h2>

          <div className="travel-log-layout">
            <article className="featured-article">
              {/* 左側大文章：圖片、日期、標題、摘要、作者 */}
            </article>

            <div className="article-list">
              <article className="article-card">
                {/* 右上文章 */}
              </article>

              <article className="article-card">
                {/* 右下文章 */}
              </article>
            </div>
          </div>

          <div className="section-actions">
            {/* 查看所有文章 */}
          </div>
        </div>
      </section>
  </>
}

export default Home
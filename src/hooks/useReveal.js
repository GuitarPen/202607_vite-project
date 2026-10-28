import { useEffect, useRef, useState } from 'react'

function useReveal () {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element) return

    // 先定義函式，這時還沒有執行它
    const handleIntersect = entries => {
      const entry = entries[0]
      // 元素進入畫面時
      if (entry.isIntersecting) {
        setIsVisible(true)

        // 已經出現過，就停止觀察
        observer.unobserve(element)
      }
    }

    // 建立觀察器，指定之後要執行的函式
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '0px 0px -80px 0px'
    })

    // 開始觀察
    observer.observe(element)

    // 離開首頁時，清除觀察
    return () => {
      observer.disconnect()
    }
  }, [])

  return { ref, isVisible }
}

export default useReveal

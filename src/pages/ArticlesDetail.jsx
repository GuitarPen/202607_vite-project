import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env

function ArticlesDetail () {
  const [article, setArticle] = useState({})
  const params = useParams()
  // console.log(params.id);
  const { id } = params

  useEffect(() => {
    ;(async () => {
      // console.log(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/article/${id}`);
      const res = await axios.get(
        `${VITE_API_URL}/v2/api/${VITE_API_PATH}/article/${id}`
      )
      console.log(res.data.article)
      setArticle(res.data.article)
    })()
  }, [id])

  return (
    <>
      <h2>文章</h2>
      <h1>{article.title}</h1>
      <span>{article.author}</span>
      <p>{article.description}</p>
      <img src={article.image} width='600' alt='' />
    </>
  )
}

export default ArticlesDetail

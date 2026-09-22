import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    (async () => {
      console.log(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/articles`);
      const res = await axios.get(
        `${VITE_API_URL}/v2/api/${VITE_API_PATH}/articles`
      );
      console.log(res.data.articles);
      setArticles(res.data.articles);
    })();
  }, []);

  return (
    <>
      <h1>文章列表</h1>
      <table>
        <tbody>
          {articles.map((article) => {
            return (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.author}</td>
                <td>
                  <img src={article.image} width="60" alt="" />
                </td>
                <td>
                  <Link to={`/articles/${article.id}`}>查看</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Articles;

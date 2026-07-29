import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      console.log(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/products`);
      const res = await axios.get(
        `${VITE_API_URL}/v2/api/${VITE_API_PATH}/products`
      );
      console.log(res.data.products);
      setProducts(res.data.products);
    })();
  }, []);

  return (
    <>
      <h1>產品列表</h1>
      <table>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>
                  <img src={product.imageUrl} width="60" alt="" />
                </td>
                <td>
                  <Link to={`/products/${product.id}`}>查看</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Products;

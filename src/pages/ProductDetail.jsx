import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

function ProductDetail() {
  const [product, setProduct] = useState({});
  const params = useParams();
  // console.log(params.id);
  const { id } = params;

  useEffect(() => {
    (async () => {
      // console.log(`${VITE_API_URL}/v2/api/${VITE_API_PATH}/product/${id}`);
      const res = await axios.get(
        `${VITE_API_URL}/v2/api/${VITE_API_PATH}/product/${id}`
      );
      console.log(res.data.product);
      setProduct(res.data.product);
    })();
  }, [id]);

  return (
    <>
      <h2>產品</h2>
      {product.title}
      <img src={product.imageUrl} width="600" alt="" />
    </>
  );
}

export default ProductDetail;

import axiosInstance from "./Axios";
import { useEffect, useState } from "react";

function AxiosFun() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error}</h3>;

  return (
    <>
      {products.map((p) => (
        <h2 key={p.id}>
          {p.title} - {p.brand}
        </h2>
      ))}
    </>
  );
}

export default AxiosFun;

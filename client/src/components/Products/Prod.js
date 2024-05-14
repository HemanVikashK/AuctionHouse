import React, { useEffect, useState } from "react";
import "./prod.css";

function Prod() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/product/allproducts");
      const data = await response.json();
      if (data.status) {
        setProducts(data.data);
      } else {
        console.error("Error fetching products");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container10">
      {products.map((product) => (
        <div key={product.id} className="wrapper">
          <div className="banner-image">
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
          </div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="button-wrapper">
            <button className="btn outline">DETAILS</button>
            <button className="btn fill">BUY NOW</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Prod;

import React, { useEffect, useState } from "react";
import "./prod.css";

const CountdownTimer = ({ time, onTimerEnd }) => {
  const [remainingTime, setRemainingTime] = useState(time);

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1000 : 0));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      onTimerEnd();
    }
  }, [remainingTime, onTimerEnd]);

  const formatTime = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return <span>{formatTime(remainingTime)}</span>;
};

function Prod() {
  const [products, setProducts] = useState([]);
  const [timerEndedProducts, setTimerEndedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/product/allproducts");
      const data = await response.json();
      if (data.status) {
        const currentTime = new Date();

        // Split products into two groups: active and ended timers
        const [activeTimers, endedTimers] = data.data.reduce(
          (acc, product) => {
            const remainingTime =
              new Date(product.auction_start_time) - currentTime;
            if (remainingTime <= 0 || product.timerEnded) {
              acc[1].push(product); // ended timers
            } else {
              acc[0].push({ ...product, remainingTime }); // active timers with remaining time
            }
            return acc;
          },
          [[], []]
        );

        // Sort active timers by remaining time
        const sortedActiveTimers = activeTimers.sort(
          (a, b) => a.remainingTime - b.remainingTime
        );

        // Combine active timers and ended timers
        const sortedProducts = [...sortedActiveTimers, ...endedTimers];

        setProducts(sortedProducts);
      } else {
        console.error("Error fetching products");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTimerEnd = (productId) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === productId ? { ...product, timerEnded: true } : product
      );
      const timerEndedProduct = updatedProducts.find(
        (product) => product.id === productId
      );
      setTimerEndedProducts((prevTimerEndedProducts) => [
        ...prevTimerEndedProducts,
        timerEndedProduct,
      ]);
      return updatedProducts.filter((product) => product.id !== productId);
    });
  };

  return (
    <div>
      <div className="filters container">
        <div></div>
      </div>
      <h3 style={{ flex: "none" }}>All Products</h3>
      <div className="container10">
        {[...timerEndedProducts, ...products].map((product) => (
          <div key={product.id} className="wrapper">
            <div className="banner-image">
              <img
                src={product.image_url}
                alt={product.name}
                className="product-image"
              />
            </div>
            <h1>{product.name}</h1>
            <p style={{ fontSize: "medium" }}>
              Starting From
              <br></br>₹{product.starting_price}
            </p>
            <div
              className="tag-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className={`tag`}>{product.main_category}</div>
              <div className={`tag`}>{product.sub_category}</div>
            </div>
            <div className="button-wrapper">
              {product.auction_start_time && !product.timerEnded ? (
                <>
                  <button className="btn outline">VIEW DETAILS</button>
                  {new Date(product.auction_start_time) - new Date() > 0 && (
                    <p style={{ fontSize: "medium" }}>
                      Auction will start in :<br />
                      <CountdownTimer
                        time={new Date(product.auction_start_time) - new Date()}
                        onTimerEnd={() => handleTimerEnd(product.id)}
                      />
                    </p>
                  )}
                  {new Date(product.auction_start_time) - new Date() > 0 &&
                    new Date(product.auction_start_time) - new Date() <
                      10 * 60 * 1000 && (
                      <button className="btn fill">JOIN LIVE AUCTION</button>
                    )}

                  {new Date(product.auction_start_time) - new Date() < 0 && (
                    <p style={{ fontSize: "medium" }}>
                      <button className="btn closed" disabled>
                        CLOSED
                      </button>
                    </p>
                  )}
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Prod;

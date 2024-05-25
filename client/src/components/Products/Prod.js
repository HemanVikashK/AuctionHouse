import React, { useEffect, useState } from "react";
import "./prod.css";
import { mainCategories, subCategories } from "./categories"; // Import the shared categories
import { useNavigate } from "react-router-dom";
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
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  useEffect(() => {
    fetchProducts();
  }, [mainCategory, subCategory, searchTerm, currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://13.233.254.58:5000/product/allproductsunsold"
      );
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

        // Apply category and search filters
        const filteredProducts = sortedProducts.filter((product) => {
          return (
            (!mainCategory || product.main_category === mainCategory) &&
            (!subCategory || product.sub_category === subCategory) &&
            (!searchTerm ||
              product.name.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

        // Pagination
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = filteredProducts.slice(
          indexOfFirstProduct,
          indexOfLastProduct
        );

        setProducts(currentProducts);
      } else {
        console.error("Error fetching products");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleJoinAuction = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => (
    <li
      key={number}
      className={currentPage === number ? "active" : ""}
      onClick={() => setCurrentPage(number)}
    >
      {number}
    </li>
  ));

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

  const handleMainCategoryClick = (category) => {
    setMainCategory(mainCategory === category ? "" : category);
  };

  const handleSubCategoryClick = (category) => {
    setSubCategory(subCategory === category ? "" : category);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div>
      <h3 style={{ flex: "none", width: "100%", textAlign: "center" }}>
        Refresh 10 minutes before auction starts to join
      </h3>
      <div className="filters container">
        <div className="tag-container">
          {mainCategories.map((category) => (
            <div
              key={category}
              className={`tag ${mainCategory === category ? "selected" : ""}`}
              onClick={() => handleMainCategoryClick(category)}
            >
              {category}
            </div>
          ))}
        </div>
        <div className="tag-container">
          {subCategories.map((category) => (
            <div
              key={category}
              className={`tag ${subCategory === category ? "selected" : ""}`}
              onClick={() => handleSubCategoryClick(category)}
            >
              {category}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: "10px", padding: "5px" }}
        />
      </div>
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
              <br />₹{product.starting_price}
            </p>
            <div className="tag-container">
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
                      <button
                        className="btn fill"
                        onClick={() => handleJoinAuction(product.id)}
                      >
                        JOIN LIVE AUCTION
                      </button>
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
      <ul
        className="pagination"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <li onClick={handlePrevPage}>
          <button className="btn outline" style={{ marginRight: "10px" }}>
            &laquo; Prev
          </button>
        </li>
        {currentPage}
        <li onClick={handleNextPage}>
          <button className="btn outline" style={{ marginLeft: "10px" }}>
            Next &raquo;
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Prod;

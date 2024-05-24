import React, { useEffect, useState } from "react";
import "../Products/prod.css";
import { mainCategories, subCategories } from "../Products/categories";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

function History() {
  const [products, setProducts] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [totalFilteredProducts, setTotalFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    fetchSoldProducts();
  }, [mainCategory, subCategory, searchTerm, currentPage]);

  const fetchSoldProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/product/allproductssold"
      );
      const data = await response.json();
      if (data.status) {
        const filteredProducts = data.data.filter((product) => {
          return (
            (!mainCategory || product.main_category === mainCategory) &&
            (!subCategory || product.sub_category === subCategory) &&
            (!searchTerm ||
              product.name.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

        setTotalFilteredProducts(filteredProducts);

        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = filteredProducts.slice(
          indexOfFirstProduct,
          indexOfLastProduct
        );

        setProducts(currentProducts);
      } else {
        console.error("Error fetching sold products");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleViewAuction = async (productId) => {
    console.log(productId);
    const response = await fetch(
      `http://localhost:5000/product/auctionresult/${productId}`
    );
    const data = await response.json();
    console.log(data);
    if (data.status) {
      setSelectedProduct(productId);

      setBids(data.data[0].bids);
      setShowModal(true);
    } else {
      console.error("Error fetching auction details");
    }
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

  const handleClose = () => setShowModal(false);

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(totalFilteredProducts.length / productsPerPage);
    i++
  ) {
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

  return (
    <div>
      <h3 style={{ flex: "none", width: "100%", textAlign: "center" }}>
        Sold Products
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
            <p style={{ fontSize: "medium" }}>
              Sold For
              <br />₹{product.sold_at}
            </p>
            <p style={{ fontSize: "medium" }}>
              Sold To
              <br />
              {product.sold_to}
            </p>
            <div className="tag-container">
              <div className={`tag`}>{product.main_category}</div>
              <div className={`tag`}>{product.sub_category}</div>
            </div>
            <div className="button-wrapper">
              <button
                className="btn outline"
                onClick={() => handleViewAuction(product.id)}
              >
                VIEW DETAILS
              </button>
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
        {renderPageNumbers}
        <li onClick={handleNextPage}>
          <button className="btn outline" style={{ marginLeft: "10px" }}>
            Next &raquo;
          </button>
        </li>
      </ul>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bids for Product {selectedProduct}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bids.map((bid, index) => (
            <h5 key={index}>
              {bid.user} had bid ₹{bid.amount}
            </h5>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default History;

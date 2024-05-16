import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import "./sell.css"; // Import the CSS file

function Sell() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [auctionStartTime, setAuctionStartTime] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const { user } = useAuth();
  const submit = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("Please login first.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("starting_price", startingPrice);
    formData.append("userid", user.id);
    formData.append("auction_start_time", auctionStartTime);
    formData.append("main_category", mainCategory);
    formData.append("sub_category", subCategory);

    try {
      const response = await fetch("http://localhost:5000/product/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setFile(null);
        setPreviewUrl(null);
        setName("");
        setDescription("");
        setStartingPrice("");
        setMainCategory("");
        setSubCategory("");
        console.log("Post submitted successfully!");
      } else {
        console.error("Failed to submit post:", await response.text());
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleMainCategoryClick = (category) => {
    setMainCategory(mainCategory === category ? "" : category);
  };

  const handleSubCategoryClick = (category) => {
    setSubCategory(subCategory === category ? "" : category);
  };

  return (
    <div className="container10">
      {!user ? (
        <div style={{ textAlign: "center", color: "black", fontSize: "50px" }}>
          Please login first.
        </div>
      ) : (
        <div style={{ width: "100%", display: "flex" }}>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "5px",
            }}
          >
            <form onSubmit={submit}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              />
              <input
                type="datetime-local"
                placeholder="Auction Start Time"
                value={auctionStartTime}
                onChange={(e) => setAuctionStartTime(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              />

              <input
                type="number"
                placeholder="Starting Price"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              />
              <h7>Category</h7>
              <div className="tag-container">
                <div
                  className={`tag ${
                    mainCategory === "Antique" ? "selected" : ""
                  }`}
                  onClick={() => handleMainCategoryClick("Antique")}
                >
                  Antique
                </div>
                <div
                  className={`tag ${
                    mainCategory === "Collectible" ? "selected" : ""
                  }`}
                  onClick={() => handleMainCategoryClick("Collectible")}
                >
                  Collectible
                </div>
                <div
                  className={`tag ${
                    mainCategory === "HandCrafted" ? "selected" : ""
                  }`}
                  onClick={() => handleMainCategoryClick("HandCrafted")}
                >
                  HandCrafted
                </div>
                <div
                  className={`tag ${
                    mainCategory === "LimitedEdition" ? "selected" : ""
                  }`}
                  onClick={() => handleMainCategoryClick("LimitedEdition")}
                >
                  Limited Edition
                </div>
                <div
                  className={`tag ${
                    mainCategory === "Luxury" ? "selected" : ""
                  }`}
                  onClick={() => handleMainCategoryClick("Luxury")}
                >
                  Luxury
                </div>
                <div
                  className={`tag ${
                    mainCategory === "Pre-Owned" ? "selected" : ""
                  }`}
                  onClick={() => handleMainCategoryClick("Pre-Owned")}
                >
                  Pre-Owned
                </div>
              </div>
              <h7>Sub-Category</h7>
              <div className="tag-container">
                <div
                  className={`tag ${
                    subCategory === "Furniture" ? "selected" : ""
                  }`}
                  onClick={() => handleSubCategoryClick("Furniture")}
                >
                  Furniture
                </div>
                <div
                  className={`tag ${
                    subCategory === "Electronics" ? "selected" : ""
                  }`}
                  onClick={() => handleSubCategoryClick("Electronics")}
                >
                  Electronics
                </div>
                <div
                  className={`tag ${
                    subCategory === "Fasion" ? "selected" : ""
                  }`}
                  onClick={() => handleSubCategoryClick("Fasion")}
                >
                  Fasion
                </div>
                <div
                  className={`tag ${
                    subCategory === "Automobiles" ? "selected" : ""
                  }`}
                  onClick={() => handleSubCategoryClick("Automobiles")}
                >
                  Automobiles
                </div>
                <div
                  className={`tag ${
                    subCategory === "Beauty & Toys" ? "selected" : ""
                  }`}
                  onClick={() => handleSubCategoryClick("Beauty & Toys")}
                >
                  Beauty & Toys
                </div>
                {/* Add more subcategory tags here */}
              </div>

              <button
                type="submit"
                style={{
                  padding: "5px 10px",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </form>
          </div>
          {!previewUrl ? (
            <div className="upload-container">
              <input onChange={handleFileChange} type="file" accept="image/*" />
            </div>
          ) : (
            <>
              <div className="upload-container">
                <div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="image-preview"
                  />
                </div>
                <button
                  className="remove-button"
                  type="button"
                  onClick={removeImage}
                >
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Sell;

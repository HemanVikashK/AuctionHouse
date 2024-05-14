import React, { useState } from "react";
import { useAuth } from "../../AuthContext";

function Sell() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");

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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
        width: "50%",
        margin: "0 auto",
        marginTop: "50px",
        marginBottom: "50px",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        backgroundColor: "rgba(20, 24, 30, 0.25)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.125)",
        padding: "38px",
        filter: "drop-shadow(0 30px 10px rgba(0, 0, 0, 0.125))",
      }}
    >
      {!user ? (
        <div style={{ textAlign: "center", color: "black", fontSize: "50px" }}>
          Please login first.
        </div>
      ) : (
        <div style={{ width: "90%" }}>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "5px",
            }}
          >
            <form onSubmit={submit}>
              <input onChange={handleFileChange} type="file" accept="image/*" />
              {previewUrl && (
                <div>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                  />
                  <button type="button" onClick={removeImage}>
                    Remove
                  </button>
                </div>
              )}
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
                type="number"
                placeholder="Starting Price"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
              />
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
        </div>
      )}
    </div>
  );
}

export default Sell;

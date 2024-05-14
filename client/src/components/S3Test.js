import React, { useState } from "react";

function S3Test() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("image", file);
    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setFile(null);
        setPreviewUrl(null);
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
    <form onSubmit={submit}>
      <input onChange={handleFileChange} type="file" accept="image/*" />
      {previewUrl && (
        <div>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "1000px", maxHeight: "1000px" }}
          />
          <button type="button" onClick={removeImage}>
            Remove
          </button>
        </div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}

export default S3Test ;

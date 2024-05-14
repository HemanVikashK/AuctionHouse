// App.js
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header/Header";

import LoginPopup from "./components/login/LoginPopup";
import Footer from "./components/Footer/Footer";
import Prod from "./components/Products/Prod";
import Sell from "./components/Sell/Sell";
import History from "./components/History/History";
import About from "./components/About/About";
import S3Test from "./components/S3Test";
import AuctionComponent from "./components/AuctionComponent/AuctionComponent";

import Home from "./components/Home/Home";
function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <Header setShowLogin={setShowLogin} />
        <GoogleOAuthProvider clientId="204881739477-h99d4981ph7u1nm2ttqg53kbf7s8i1u0.apps.googleusercontent.com">
          <LoginPopup show={showLogin} onHide={() => setShowLogin(false)} />
        </GoogleOAuthProvider>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/bid-now" element={<Prod />} />
          <Route path="/sell-now" element={<Sell />} />
          <Route path="/bid-history" element={<History />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/auction" element={<AuctionComponent />} />

          <Route path="/test" element={<S3Test />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

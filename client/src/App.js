import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import LoginPopup from "./components/login/LoginPopup";
import Prod from "./components/Products/Prod";
import Sell from "./components/Sell/Sell";
import History from "./components/History/History";
import About from "./components/About/About";
import AuctionComponent from "./components/AuctionComponent/AuctionComponent";
import Home from "./components/Home/Home";

import MainLayout from "./layouts/MainLayout";
import SimpleLayout from "./layouts/SimpleLayout";
import Sitemap from "./components/Sitemap/Sitemap";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <GoogleOAuthProvider clientId="204881739477-h99d4981ph7u1nm2ttqg53kbf7s8i1u0.apps.googleusercontent.com">
          <LoginPopup show={showLogin} onHide={() => setShowLogin(false)} />
        </GoogleOAuthProvider>
        <Routes>
          <Route element={<MainLayout setShowLogin={setShowLogin} />}>
            <Route path="/" element={<Home />} />
            <Route path="/bid-now" element={<Prod />} />
            <Route path="/sell-now" element={<Sell />} />
            <Route path="/bid-history" element={<History />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/sitemap" element={<Sitemap />} />
          </Route>
          <Route element={<SimpleLayout />}>
            <Route path="/product/:prodid" element={<AuctionComponent />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

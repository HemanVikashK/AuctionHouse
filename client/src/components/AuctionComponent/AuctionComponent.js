import React, { useEffect, useState, useRef, useCallback } from "react";
import socketIOClient from "socket.io-client";
import "./auction.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { debounce } from "lodash";

const AuctionComponent = () => {
  const [currentBid, setCurrentBid] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [timer, setTimer] = useState(0);
  const [soldTo, setSoldTo] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const { prodid } = useParams();
  const { user } = useAuth();
  const [productDetails, setProductDetails] = useState(null);
  const socketRef = useRef();
  const timerIntervalRef = useRef(null); // Ref to hold the interval ID
  const highestBidderRef = useRef(null); // Ref to track the highest bidder

  // New state for sidebar view
  const [activeSidebarView, setActiveSidebarView] = useState("bids");

  useEffect(() => {
    if (!user) return;

    socketRef.current = socketIOClient(
      "https://auction-house-backend.vercel.app"
    );
    const socket = socketRef.current;

    fetchProdDetails(prodid);
    socket.emit("joinRoom", prodid, user.username);

    socket.on("bidUpdate", (data) => {
      setCurrentBid(data.currentBid);
      setBidHistory(data.bidHistory);
      if (data.bidHistory.length === 1) {
        startTimer(30);
      } else {
        startTimer(30); // Restart the timer to 30 seconds on every new bid
      }
      highestBidderRef.current =
        data.bidHistory[data.bidHistory.length - 1].user;
      setSoldTo(null);
      setBidAmount("");
    });

    socket.on("purchaseConfirmed", (winnerId) => {
      setSoldTo(winnerId);
    });

    socket.on("usersOnline", (users) => {
      setOnlineUsers(users);
    });

    socket.on("userConnected", (username) => {
      setBidHistory((prevHistory) => [
        ...prevHistory,
        { user: username, amount: "has joined the auction" },
      ]);
    });

    socket.on("chatMessage", (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit("leaveRoom", prodid);
      socket.disconnect();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [user, prodid]);

  useEffect(() => {
    if (timer === 0 && currentBid > 0 && !soldTo) {
      socketRef.current.emit("confirmPurchase", prodid);
    }
  }, [timer, currentBid, soldTo, prodid]);

  useEffect(() => {
    const timerElement = document.querySelector(".timer");
    if (timerElement) {
      runTimer(timerElement);
    }
  }, [timer]);

  const fetchProdDetails = async (prodid) => {
    const response = await fetch(
      "https://auction-house-backend.vercel.app/product/prod",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prodid }),
      }
    );
    const data = await response.json();
    console.log(data);
    setProductDetails(data.data);
  };

  const debouncedHandleBid = useCallback(
    debounce((amount, prodid, username) => {
      socketRef.current.emit("handleBid", amount, prodid, username);
    }, 300),
    []
  );

  const handleBid = () => {
    if (
      !soldTo &&
      bidAmount.trim() !== "" &&
      parseInt(bidAmount) > currentBid
    ) {
      debouncedHandleBid(parseInt(bidAmount), prodid, user.username);
      setBidAmount("");
    }
  };

  const handleChange = (event) => setBidAmount(event.target.value);

  const handleChatMessageChange = (event) => setChatMessage(event.target.value);

  const sendChatMessage = () => {
    if (chatMessage.trim() !== "") {
      socketRef.current.emit("sendChatMessage", {
        user: user.username,
        message: chatMessage,
      });
      setChatMessage("");
    }
  };

  const formatBidMessage = (user, amount) => {
    if (amount === "has joined the auction") {
      return `${user} ${amount}`;
    }
    return `${user} has bid ₹${amount}`;
  };

  const updateBidHistory = (message) => {
    setBidHistory((prevHistory) => [
      ...prevHistory,
      { user: "System", amount: message },
    ]);
  };

  const runTimer = (timerElement) => {
    const timerCircle = timerElement.querySelector("svg > circle + circle");
    timerElement.classList.add("animatable");
    timerCircle.style.strokeDashoffset = 1;

    setTimer((prevTimer) => {
      if (prevTimer > 0) {
        const normalizedTime = (30 - prevTimer) / 30;
        timerCircle.style.strokeDashoffset = normalizedTime;
        timerElement.querySelector("#timeLeft").textContent = prevTimer;

        // Display special messages for the last 3 seconds
        const highestBidder = highestBidderRef.current;
        if (prevTimer === 3) {
          updateBidHistory(`Selling to ${highestBidder} once`);
        } else if (prevTimer === 2) {
          updateBidHistory(`Selling to ${highestBidder} twice`);
        } else if (prevTimer === 1) {
          updateBidHistory(`Selling to ${highestBidder} thrice`);
        } else if (prevTimer === 0) {
          updateBidHistory(`Sold to ${highestBidder}`);
        }
        return prevTimer;
      } else {
        return 0;
      }
    });
  };

  const startTimer = (initialTime) => {
    setTimer(initialTime);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(timerIntervalRef.current);
          return 0;
        }
      });
    }, 1000);
  };

  if (!user || !productDetails) return <div>Loading...</div>;
  if (productDetails.status === "sold")
    return <div>The Product is already sold</div>;
  return (
    <div className="auction-container">
      <div className="side-panel">
        <div className="sidebar-icons">
          <button
            onClick={() => setActiveSidebarView("users")}
            className={activeSidebarView === "users" ? "selected" : ""}
          >
            <i className="fas fa-users"></i>
            {onlineUsers.length}
          </button>
          <button
            onClick={() => setActiveSidebarView("chat")}
            className={activeSidebarView === "chat" ? "selected" : ""}
          >
            <i className="fas fa-comments"></i>
          </button>
        </div>

        {activeSidebarView === "users" ? (
          <div className="users-online">
            <h3>Users Online</h3>
            <ul>
              {onlineUsers.map((user, index) => (
                <li key={index}>
                  <i className="fas fa-user"> {user}</i>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="chat-messages users-online">
            <div className="messages" style={{ zIndex: "9" }}>
              {chatMessages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <strong>{msg.user}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <div
              className="chat-input"
              style={{ position: "absolute", bottom: "40px" }}
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={chatMessage}
                onChange={handleChatMessageChange}
                style={{ width: "80%", marginRight: "10px" }}
              />
              <button className="placebid" onClick={sendChatMessage}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="main-content">
        <div className="product-details">
          <h2>{productDetails.name}</h2>
          <img
            className="prod-img"
            src={productDetails.image_url}
            alt={productDetails.name}
          />
          <div className="timer-container">
            <h5>Time Left</h5>
            <div className="timer animatable">
              <svg>
                <circle cx="50%" cy="50%" r="50" />
                <circle cx="50%" cy="50%" r="50" pathLength="1" />
                <text x="50%" y="50%" textAnchor="middle" dy=".3em">
                  <tspan id="timeLeft">{timer}</tspan>
                </text>
                <text x="50%" y="70%" textAnchor="middle">
                  seconds
                </text>
              </svg>
            </div>
          </div>

          <div className="current-bid" style={{ fontSize: "20px" }}>
            <p style={{ fontSize: "20px", width: "80%" }}>
              {productDetails.description}
            </p>
          </div>
          <p style={{ fontSize: "20px" }}>
            {" "}
            Bid Starting From
            <br /> ₹{productDetails.starting_price}
          </p>
        </div>
      </div>
      <div className="side-panel">
        <div className="sidebar-icons">
          <button
            onClick={() => setActiveSidebarView("bids")}
            className={activeSidebarView === "bids" ? "selected" : ""}
          >
            <i className="fa fa-gavel"></i>
          </button>
        </div>
        <div className="bid-history">
          {bidHistory.map((bid, index) => (
            <div key={index} className="bid-item">
              <span>
                {bid.user === "System"
                  ? bid.amount
                  : formatBidMessage(bid.user, bid.amount)}
              </span>
            </div>
          ))}
        </div>
        Current Bid: {currentBid}
        {soldTo && <p style={{ fontSize: "20px" }}>Sold to: {soldTo}</p>}
        <div className="bid-input">
          <input
            type="number"
            placeholder="Enter your bid"
            value={bidAmount}
            onChange={handleChange}
            disabled={!!soldTo}
          />
          <button className="placebid" onClick={handleBid} disabled={!!soldTo}>
            Raise Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionComponent;

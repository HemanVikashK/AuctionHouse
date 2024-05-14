// AuctionComponent.jsx

import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import "./auction.css";

const AuctionComponent = () => {
  const [currentBid, setCurrentBid] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [timer, setTimer] = useState(0);
  const [soldTo, setSoldTo] = useState(null);
  const [roomId, setRoomId] = useState("auctionRoom"); // Room ID for the auction
  const [bidAmount, setBidAmount] = useState("");
  const socket = socketIOClient("http://localhost:5000");

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("bidUpdate", (data) => {
      setCurrentBid(data.currentBid);
      setBidHistory(data.bidHistory);
      if (data.bidHistory.length === 1) {
        // Start the timer after the first bid
        setTimer(30);
      }
      setSoldTo(null); // Reset soldTo when a new bid is made
      setBidAmount("");
    });

    socket.on("purchaseConfirmed", (winnerId) => {
      setSoldTo(winnerId);
    });

    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else if (currentBid > 0 && !soldTo) {
        // Confirm purchase if timer ends and there is a bid
        socket.emit("confirmPurchase", roomId);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      socket.emit("leaveRoom", roomId);
      socket.disconnect();
    };
  }, [currentBid, bidHistory, timer, soldTo, roomId]);

  const handleBid = () => {
    if (!soldTo && bidAmount.trim() !== "") {
      socket.emit("bid", { amount: parseInt(bidAmount), roomId });
    }
  };

  const handleChange = (event) => {
    setBidAmount(event.target.value);
  };

  return (
    <div className="auction-container">
      <div className="bid-history">
        {bidHistory.map((bid, index) => (
          <div key={index} className="bid-item">
            <span>{bid.user}:</span> <span>{bid.amount}</span>
          </div>
        ))}
      </div>
      <div className="bid-input">
        <input
          type="number"
          placeholder="Enter your bid"
          value={bidAmount}
          onChange={handleChange}
          disabled={!!soldTo}
        />
        <button onClick={handleBid} disabled={!!soldTo}>
          Place Bid
        </button>
      </div>
      <div className="current-bid">
        Current Bid: {currentBid}
        {soldTo && <p>Sold to: {soldTo}</p>}
      </div>
      <div className="timer">Time remaining: {timer} seconds</div>
    </div>
  );
};

export default AuctionComponent;

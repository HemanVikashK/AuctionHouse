const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const pool = require("./utils/db"); // Import the database connection

const userRoute = require("./routes/userRoute");
const prodRoute = require("./routes/productRoute");

const app = express();

const corsOptions = {
  origin: "http://13.233.254.58:3000", // Your frontend URL
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/product", prodRoute);
app.use("/user", userRoute);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://13.233.254.58:3000", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let rooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId, username) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username;
    console.log(`Socket ${username} joined room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        currentBid: 0,
        bidHistory: [],
        soldTo: "",
        chatMessages: [], // Add chatMessages array
      };
    }
    rooms[roomId].users.push(username);
    io.to(roomId).emit("usersOnline", rooms[roomId].users);
  });

  socket.on("handleBid", (amount, roomId, user) => {
    if (!rooms[roomId].soldTo) {
      rooms[roomId].currentBid = amount;
      rooms[roomId].bidHistory.push({ user, amount });
      io.to(roomId).emit("bidUpdate", {
        currentBid: rooms[roomId].currentBid,
        bidHistory: rooms[roomId].bidHistory,
      });
    }
  });

  socket.on("confirmPurchase", async (prodid) => {
    if (!rooms[socket.roomId].soldTo && rooms[socket.roomId].currentBid > 0) {
      const highestBidder =
        rooms[socket.roomId].bidHistory[
          rooms[socket.roomId].bidHistory.length - 1
        ].user;

      rooms[socket.roomId].soldTo = highestBidder;
      const lastbid = rooms[socket.roomId].currentBid;
      try {
        await pool.query(
          "UPDATE products SET status = $1,sold_to=$2,sold_at=$3 WHERE id = $4",
          ["sold", highestBidder, lastbid, prodid]
        );
        console.log(`Product ${prodid} marked as sold to ${highestBidder}`);
      } catch (error) {
        console.error("Error updating product status:", error);
      }

      // Insert the auction result into the auction_results table
      try {
        await pool.query(
          "INSERT INTO auction_results (product_id, buyer, bids) VALUES ($1, $2, $3)",
          [
            prodid,
            highestBidder,
            JSON.stringify(rooms[socket.roomId].bidHistory),
          ]
        );
        console.log(
          `Auction result for product ${prodid} recorded successfully`
        );
      } catch (error) {
        console.error("Error inserting auction result:", error);
      }

      io.to(socket.roomId).emit(
        "purchaseConfirmed",
        rooms[socket.roomId].soldTo
      );
    }
  });

  socket.on("sendChatMessage", (message) => {
    const { roomId, username } = socket;
    if (rooms[roomId]) {
      const chatMessage = { user: username, message: message.message };
      rooms[roomId].chatMessages.push(chatMessage);
      io.to(roomId).emit("chatMessage", chatMessage);
    }
  });

  socket.on("leaveRoom", () => {
    if (rooms[socket.roomId]) {
      socket.leave(socket.roomId);
      console.log(`Socket ${socket.username} left room ${socket.roomId}`);
      rooms[socket.roomId].users = rooms[socket.roomId].users.filter(
        (user) => user !== socket.username
      );
      io.to(socket.roomId).emit("usersOnline", rooms[socket.roomId].users);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    if (rooms[socket.roomId]) {
      rooms[socket.roomId].users = rooms[socket.roomId].users.filter(
        (user) => user !== socket.username
      );
      io.to(socket.roomId).emit("usersOnline", rooms[socket.roomId].users);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

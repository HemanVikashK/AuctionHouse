const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const userRoute = require("./routes/userRoute");
const prodRoute = require("./routes/productRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/product", prodRoute);
app.use("/user", userRoute);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let currentBid = 0;
let bidHistory = [];
let soldTo = null;

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  socket.on("bid", ({ amount, roomId }) => {
    if (!soldTo) {
      currentBid = amount;
      bidHistory.push({ user: socket.id, amount });
      io.to(roomId).emit("bidUpdate", { currentBid, bidHistory });
    }
  });

  socket.on("confirmPurchase", (roomId) => {
    if (!soldTo && currentBid > 0) {
      soldTo = bidHistory[bidHistory.length - 1].user;
      io.to(roomId).emit("purchaseConfirmed", soldTo);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

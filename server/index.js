const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

// build server through socket.io as instance
const io = new Server(server, {
  // solved front and back connection problems on browser by cors
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// do something in server with on method
// events: connection, join_room, disconnect command
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`)
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
})

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});

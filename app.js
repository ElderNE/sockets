const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "https://sockets-obuu.onrender.com:4000" },
});

const PORT = 4000;

io.on("connection", (socket) => {
  console.log("Connected");

  //Joining a room
  socket.on('joinRoom', async(room, socketId) => {
    let currentRoom = io.sockets.adapter.rooms.get(room);
    if (currentRoom == undefined || currentRoom.size == 1 || currentRoom.size == 1) {
      socket.join(room);
      // Broadcasting a message to a room
      socket.on('message', (data) => {
        const { room, message } = data;
        socket.broadcast.to(room).emit('message', { message, from: socket.id });
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`listening on Port ${PORT}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "https://sockets-obuu.onrender.com:4000" },
});

const PORT = 4000 || process.env.PORT;

io.on("connection", (socket) => {
  console.log("Connected");

  //Joining a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  // Leaving a room
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });

  // Broadcasting a message to a room
  socket.on('message', (data) => {
    const { room, message } = data;
    socket.broadcast.to(room).emit('message', { message, from: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

function error(err, req, res, next) {
  // log it
  if (!test) console.error(err.stack);

  // respond with 500 "Internal Server Error".
  res.status(500);
  res.send("Internal Server Error");
}
//app.use(error);
server.listen(PORT, () => {
  console.log(`listening on Port ${PORT}`);
});

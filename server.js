import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  const url = new URL("./index.html", import.meta.url).pathname;
  console.log(url);
  res.sendFile(new URL("./index.html", import.meta.url).pathname);
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

server.listen(10000, () => {
  console.log("server running at ");
});

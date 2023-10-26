import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "node:http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const history = [];

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  const filePath = join(__dirname, "index.html");
  res.sendFile(filePath);
});

io.on("connection", async (socket) => {
  for (let i = 0; i < history.length; i++) {
    socket.emit("chat message", history[i]);
  }

  const clients = await io.allSockets();
  const clientId = getClientId(socket);

  io.emit(
    "chat message",
    "[" +
      clientId +
      "]" +
      "👻 " +
      " has joined. Current whisperers: " +
      clients.size
  );
  socket.on("chat message", (msg) => {
    handleChatHistory(msg);
    io.emit("chat message", msg);
  });
});

function handleChatHistory(msg) {
  history.push(msg);
  if (history.length > 99) history.shift();
}

function getClientId(socket) {
  const socketIdArray = socket.id.match(/[A-Za-z]/g);
  const socketIdSet = [...new Set(socketIdArray)];
  console.log(socketIdArray);
  const id =
    socketIdSet[0].toUpperCase() +
    socketIdSet[1].toLowerCase() +
    socketIdSet[2].toLowerCase();

  return id;
}

server.listen(10000, () => {
  console.log("server running at ");
});

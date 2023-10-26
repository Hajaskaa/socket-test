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
  const id = socket.id[0] + socket.id[1] + socket.id[2];
  const clients = await io.allSockets();

  for (let i = 0; i < history.length; i++) {
    socket.emit("chat message", history[i]);
  }

  io.emit(
    "chat message",
    "[" + id + "]" + "👻 " + " has joined. Current whisperers: " + clients.size
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

server.listen(10000, () => {
  console.log("server running at ");
});

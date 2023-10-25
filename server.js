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

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  const filePath = join(__dirname, "index.html");
  res.sendFile(filePath);
});

io.on("connection", async (socket) => {
  const id = socket.id[0] + socket.id[1] + socket.id[2];
  const idCount = await io.allSockets();
  console.log(idCount);

  io.emit(
    "chat message",
    "[" + id + "]" + "👻 " + " has joined. Current whisperers: " + idCount.size
  );
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

server.listen(10000, () => {
  console.log("server running at ");
});

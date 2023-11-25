const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    const id = socket.id[0] + socket.id[1] + socket.id[2];
    const currentDate = new Date();

    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const timestamp = `${currentHour}:${currentMinute} - `;

    socket.emit(
      "chat message",
      timestamp + "[" + id + "]" + " 👻" + "sent a msg: " + input.value
    );
    input.value = "";
  }
});

socket.on("chat message", (msg) => {
  const item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

const socket = io();

var form = document.getElementById("form");
var input = document.getElementById("input");
const userList = document.querySelector(".user-list");
const chatContent = document.querySelector(".chat-content");
const currentUserId = parseInt(document.querySelector('#current-user-id').innerHTML)
const selectedRoom = localStorage.getItem("selectedRoomName");


userList.addEventListener("click", (e) => {
  const button = e.target.closest(".user-button");

  if (button) {
    const selectedId = parseInt(button.dataset.userId, 10);
    const sortedNumbers = [currentUserId, selectedId].sort((a, b) => a - b);
    const selectedRoomName = `chatRoom${sortedNumbers}`;
    socket.emit("join room", selectedRoomName);
    localStorage.setItem("selectedRoomName", selectedRoomName);
    window.location.href = `/chatroom/private/${selectedId}`;
  }
});


if (selectedRoom) {
  socket.emit("join room", selectedRoom);
  form.addEventListener("submit", function (e) {
  e.preventDefault();
  const selectedId = document.querySelector("#selected-user-id").innerHTML;
  if (input.value) {
    const template = document.createElement("div");
    const currentTime = getCurrentTime();
    template.innerHTML = `
      <div class="current-user d-flex flex-column align-items-end m-1">
        <div class="content p-2" style="border-radius:25px 25px 0 25px; background:#FF6600;"><p class="content-text m-0">${input.value}</p></div>
        <div class="time top-100" style="font-size: 13px; color:#657786; text-align:end">${currentTime}</div>
      </div>
    `;
    const messageData = {
      text:input.value,
      senderId:parseInt(currentUserId),
      receiverId:selectedId,
    }
    socket.emit("private message", { data:messageData});
    chatContent.appendChild(template);
    input.value = "";
  }
});

socket.on("private message", (data) => {
  console.log("前端收到io.to.emit", data);
  const currentTime = getCurrentTime();
  if (parseInt(data.senderId) !== currentUserId) {
     const template = document.querySelector(".other").cloneNode(true);
     template.children[1].children[0].children[0].textContent = `${data.text}`;
     template.children[1].children[1].textContent = `${currentTime}`;
     chatContent.appendChild(template);
  }
});
}



function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM"; // 判断是上午还是下午
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // 将小时转换为12小时制

  return `${ampm} ${formattedHours}:${String(minutes).padStart(2, "0")}`;
}

const socket = io();

var form = document.getElementById("form");
var input = document.getElementById("input");
const userList = document.querySelector('.user-list')

userList.addEventListener('click', (e) => {
  const button = e.target.closest(".user-button");
  
  if (button) {
    const selectedId = parseInt(button.dataset.userId, 10)
    console.log(selectedId)
    window.location.href = `/chatroom/private/${selectedId}`;
  }
})

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});
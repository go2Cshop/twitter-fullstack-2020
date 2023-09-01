const socket = io();

var form = document.getElementById("form");
var input = document.getElementById("input");

const postTweetForm = document.querySelector('.post-tweet-form')
const notifyMsgGroup = document.querySelector('.notify-msg-group')

// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   if (input.value) {
//     socket.emit("chat message", input.value);
//     input.value = "";
//   }
// });

postTweetForm.addEventListener("submit", function (e) {
  e.preventDefault();
  socket.emit("notifyMessage", 'XXX已發文')
  postTweetForm.submit()
})

socket.on('notifyMessage', (msg) => {
  console.log(msg)
  const msgElement = document.createElement('li')
  msgElement.textContent = msg
  notifyMsgGroup.appendChild(msgElement)
})
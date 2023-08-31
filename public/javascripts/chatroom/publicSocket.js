//connect to socket.io
var socket = io({ 'timeout': 5000, 'connect timeout': 5000 });
const onlinePeople = document.getElementById('onlinePeople')
const onlineCounts = document.getElementById('onlineCounts')
const publicPeople = document.getElementById('publicPeople')
const board = document.getElementById('board')
const publicboard = document.getElementById('publicboard')
var input = document.getElementById('input');
var form = document.getElementById('form');
var messages = document.getElementById('messages');
const username = document.getElementById('name')
const id = document.getElementById('id')
const avatar = document.getElementById('avatar')

//check for connection
if (socket !== undefined) {
  console.log('Connected to socket...')
}
socket.emit('login')

//監聽來自server端的事件名稱 onlineUsers
socket.on('onlineUsers', (onlineUsers) => {
  onlinePeople.innerHTML = ''
  let rawHtml = ''
  onlineUsers.forEach(data => {
    rawHtml = `
      <li class="row justify-content-start align-items-center rounded px-3 py-2"
        style="border-bottom: 1px solid rgba(0, 0, 0, 0.1);"
        onclick="location.href='/users/${data.id}/tweets'">
        <div class="col-2 d-flex justify-content-center align-items-center" id="onlineUsers">
          <img src="${data.avatar}"
            width="50" height="50" class="rounded-circle">
        </div>
        <div class="col-6 d-flex" style="height: 60px;">
          <h5 style="line-height: 60px; font-size: 15px; font-weight: bold;overflow:hidden; white-space: nowrap; text-overflow: ellipsis;">${data.name}</h5>
          <p class="text-muted ps-2"
            style="font-size: 15px; line-height: 60px; font-weight: 500; color:#657786;">
            @${data.account}</p>
        </div>
      </li>
    `
    onlinePeople.innerHTML += rawHtml
  })
  publicPeople.scrollTo(0, publicPeople.scrollHeight)
})

//監聽來自server端的事件名稱 onlineCounts
socket.on('onlineCounts', (counts) => {
  onlineCounts.innerText = counts
})
//監聽來自server端的事件名稱 onlineUserPop
socket.on('onlineUserPop', (userPop) => {
  let onlineUserPop = document.createElement('ul')
  onlineUserPop.classList.add('list-group', 'd-flex', 'flex-column', 'align-items-center', 'onlineUserPop')
  onlineUserPop.innerHTML = `
      <li class="list-group-item mt-2 btn-sm center" style="background-color:#E5E5E5;border-radius: 30px 30px 30px 30px; padding: 3px; font-size: 15px; color: #657786;">${userPop} 上線</li>
    `
  board.appendChild(onlineUserPop)
  publicboard.scrollTo(0, publicboard.scrollHeight)
})

//點擊事件
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', { id: Number(id.textContent), avatar: avatar.textContent, user: username.textContent, msg: input.value });
    input.value = '';
  }
});

//來自server 的事件名稱 chat message
socket.on('chat message', (data) => {
  let newMsg = document.createElement('div')
  if (data.id === Number(id.textContent)) {  //自己的msg
    newMsg.innerHTML =
    `
    <div class=" d-flex flex-row-reverse">
      <div class="flex-column" style="max-width: 400px;">
        <div style="border-radius:25px 25px 0 25px; background:#FF6600;" class="p-2">
          <p class="d-inline" style="word-wrap:break-word">
            ${data.msg}</p>
        </div>
        <p class="text-muted mx-0 bd-highlight"
          style="font-size: 0.675em; padding-left: 0.3rem; margin-top: 0.3rem;">
          ${data.time}</p>
      </div>
    </div>
    `
    board.appendChild(newMsg)
  } else {     //其他人的msg
    newMsg.innerHTML =
      `
    <div class="d-flex row">
      <div class="col-1 d-flex justify-content-center">
        <a href="/users/${data.id}" class="p-1">
          <img
            src="${data.avatar}"
            class="rounded-circle" style="width: 40px; height: 40px" alt="avatar" />
        </a>
      </div>
      <div class="pl-0 mt-3" style="max-width: 400px;">
        <div style="border-radius:0 25px 25px 25px;background:#657786;display: inline-block; max-width: 100%" class="p-2">
          <p class="d-inline" style="word-wrap:break-word">${data.msg}</p>
        </div>
        <p class="text-muted mx-0"
          style="font-size: 13px; padding-left: 1px; margin-top: 6px;line-height: 13px;">${data.time}</p>
      </div>
    </div>
    `
    board.appendChild(newMsg)
  }
  publicboard.scrollTo(0, publicboard.scrollHeight)
  var item = document.createElement('div');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

//來自server 的事件名稱 outlineUserPop
socket.on('outlineUserPop', (userPop) => {
  let outlineUserPop = document.createElement('ul')
  outlineUserPop.classList.add('list-group', 'd-flex', 'flex-column', 'align-items-center', 'outlineUserPop')
  outlineUserPop.innerHTML = `
      <li class="list-group-item mt-2 btn-sm center" style="background-color:#E5E5E5;border-radius: 30px 30px 30px 30px; padding: 3px; font-size: 15px; color: #657786;">${userPop} 離線</li>
    `
  board.appendChild(outlineUserPop)
  publicboard.scrollTo(0, publicboard.scrollHeight)
})

// const socket = io();

// var messages = document.getElementById('messages');
// var form = document.getElementById("form");
// var input = document.getElementById("input");

// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   if (input.value) {
//     socket.emit("chat message", input.value);
//     input.value = "";
//   }
// });

// socket.on('chat message', function (msg) {
//   var item = document.createElement('li');
//   item.textContent = msg;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });
(async () => {
  const socket = io()
  //取得User資料並且轉成一般物件
  const fetchUser = await fetch('/chatroom/user')
  const User = await fetchUser.json()
  //抓取[通知欄位]這個元素
  const notifyIcon = document.querySelector('.notify-icon')
  //宣告廣播頻道
  const notifyTo = `notify_to_${User.id}`
  // 宣告函式讓"通知欄"出現紅色亮點
  const notifyAddPoint = () => {
    const pointIcon = document.createElement('div')

    pointIcon.style.cssText = `
    width:8px;
    height:8px;
    border:1px solid #FFFFFF;
    border-radius:50%;
    background-color:#FF6600;
    position: absolute;
    top:30%;
    left:20%;
    `
    notifyIcon.appendChild(pointIcon)
  }
  // 如果使用者的未讀訊息大於零，加紅點在[通知欄位]
  if (User.notifyMsgCount > 0) {
    notifyAddPoint()
  }
  // 如果監聽到廣播頻道有消息，加紅點在[通知欄位]
  socket.on(notifyTo, (data) => {
    console.log(data)
    if (data.type === 'notifyMsg') notifyAddPoint()
  })
})()




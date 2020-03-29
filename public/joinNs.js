function joinNs(endpoint) {
  if (nsSocket) {
    nsSocket.close();
  }
  nsSocket = io(endpoint);
  nsSocket.on("nsRoomsLoad", rooms => {
    roomsNumEl.textContent = rooms.length;
    roomListDiv.innerHTML = "";
    rooms.forEach((room, i) => {
      roomListDiv.innerHTML += `<li id="${room.id}" class="room ${
        !i ? "active" : ""
      }">
          <span class="glyphicon glyphicon-${
            room.privateRoom ? "lock" : "globe"
          }"></span> ${room.title}
        </li>`;
    });

    // join to the first room in the namespace by default
    joinRoom(rooms[0]);

    let roomNodes = document.querySelectorAll(".room");
    roomNodes.forEach((roomNode, i) => {
      roomNode.addEventListener("click", e => {
        joinRoom(rooms[i]);
        document.querySelector(".room.active").classList.remove("active");
        roomNode.classList.add("active");
      });
    });
  });

  nsSocket.on("messageToClients", msg => {
    // console.log(msg);
    messagesDiv.append(getMessageHTML(msg));
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  document.querySelector("#user-input").onsubmit = e => {
    e.preventDefault();
    const msgInput = e.target.userMessage;
    nsSocket.emit("newMessageToServer", { text: msgInput.value });
    msgInput.value = "";
  };
}

function getMessageHTML(msg) {
  const formattedDate = new Date(msg.time).toLocaleString();
  const newMsgDiv = document.createElement("li");
  newMsgDiv.classList.add("message");
  newMsgDiv.innerHTML = `<div class="user-image">
            <img src="https://via.placeholder.com/40/${msg.user.color}?text=${msg.user.username}" />
          </div>
          <div class="user-message">
            <div class="user-name-time" style="color: #${msg.user.color}">${msg.user.username} <small>${formattedDate}</small></div>
            <div class="message-text">${msg.text}</div>
          </div>`;
  return newMsgDiv;
}

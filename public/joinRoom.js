function joinRoom(room) {
  nsSocket.emit("joinRoom", room);

  nsSocket.on("historyCatchup", history => {
    messagesDiv.innerHTML = "";
    history.forEach(msg => {
      messagesDiv.append(getMessageHTML(msg));
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  nsSocket.on("userCountUpdate", numOfUsers => {
    // update users number and room name
    document.getElementById("users-num").innerText = numOfUsers;
    document.getElementById("curr-room-name").firstChild.textContent =
      room.title + " ";
  });

  let searchBox = document.getElementById("search-box");
  searchBox.addEventListener("input", e => {
    let messages = Array.from(document.getElementsByClassName("message"));
    messages.forEach(msg => {
      if (
        msg.textContent.toLowerCase().indexOf(e.target.value.toLowerCase()) ===
        -1
      ) {
        msg.style.display = "none";
      } else {
        msg.style.display = "";
      }
    });
  });
}

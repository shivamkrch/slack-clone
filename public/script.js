const username = prompt("Enter your username: ");

const namespacesDiv = document.querySelector(".namespaces");
const roomListDiv = document.querySelector(".room-list");
const roomsNumEl = document.querySelector("#rooms-num");
const usersNumEl = document.querySelector("#users-num");
const messagesDiv = document.getElementById("messages");

const socket = io({
  query: {
    username: username
  }
});
let nsSocket;

// listen for nsList
socket.on("nsList", nsData => {
  //   console.log(nsData);
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns, i) => {
    namespacesDiv.innerHTML += `<div class="namespace ${
      !i ? "active" : ""
    }" ns="${ns.endpoint}" title="${ns.title}">
        <img src="${ns.image}" />
      </div>`;
  });

  // join to the first namespace by default
  joinNs(nsData[0].endpoint);

  document.querySelectorAll(".namespace").forEach(nsEl => {
    nsEl.addEventListener("click", e => {
      document.querySelector(".namespace.active").classList.remove("active");
      nsEl.classList.add("active");
      const nsEndpoint = nsEl.getAttribute("ns");
      joinNs(nsEndpoint);
    });
  });
});

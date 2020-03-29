const express = require("express");
const socketio = require("socket.io");

const app = express();

let namespaces = require("./data/namespaces");
let { addUser, getUser, removeUser } = require("./data/users");

app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const io = socketio(server);

// Main namespace
io.on("connection", socket => {
  addUser(socket.id, socket.handshake.query.username);

  // build an array to send back the namespaces
  let nsData = namespaces.map(({ rooms, id, ...ns }) => {
    return ns;
  });

  // send nsData to client
  socket.emit("nsList", nsData);

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// Loop through each namespace and listen for a connection
namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on("connection", nsSocket => {
    // send room info
    nsSocket.emit("nsRoomsLoad", namespace.rooms);

    // handle join room
    nsSocket.on("joinRoom", room => {
      const roomId = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomId, err => {
        updateClientsLength(namespace.endpoint, roomId);
      });
      nsSocket.join(room.id, err => {
        updateClientsLength(namespace.endpoint, room.id);
        // find room object for this room
        const nsRoom = namespace.rooms.find(rm => rm.id === room.id);
        nsSocket.emit("historyCatchup", nsRoom.history);
      });
    });

    nsSocket.on("newMessageToServer", msg => {
      const user = getUser(nsSocket.id.split("#")[1]);
      const newMsg = {
        ...msg,
        time: Date.now(),
        user
      };
      const roomId = Object.keys(nsSocket.rooms)[1];
      // find room object for this room
      const nsRoom = namespace.rooms.find(room => room.id === roomId);
      nsRoom.addMessage(newMsg);
      io.of(namespace.endpoint)
        .to(roomId)
        .emit("messageToClients", newMsg);
    });

    nsSocket.on("disconnecting", () => {
      const roomId = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomId, err => {
        updateClientsLength(namespace.endpoint, roomId);
      });
    });
  });
});

function updateClientsLength(endpoint, roomId) {
  io.of(endpoint)
    .in(roomId)
    .clients((err, clients) => {
      io.of(endpoint).emit("userCountUpdate", clients.length);
    });
}

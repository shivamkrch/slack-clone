const users = [];

function addUser(id, username) {
  users.push({
    id,
    username,
    color: Math.floor(Math.random() * 16777215).toString(16)
  });
}

function getUser(id) {
  return users.find(user => user.id === id);
}

function removeUser(id) {
  return users.filter(user => user.id !== id);
}

module.exports = {
  addUser,
  getUser,
  removeUser
};

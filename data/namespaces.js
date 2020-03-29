// Bring in the room class
const Namespace = require("../classes/Namespace");
const Room = require("../classes/Room");

// Set up the namespaces
let namespaces = [];
let wikiNs = new Namespace(
  "ns-0",
  "Wiki",
  "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png",
  "/wiki"
);
let mozNs = new Namespace(
  "ns-1",
  "Mozilla",
  "https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png",
  "/mozilla"
);
let linuxNs = new Namespace(
  "ns-2",
  "Linux",
  "https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png",
  "/linux"
);

namespaces.push(wikiNs, mozNs, linuxNs);

// Make the main room and add it to rooms. it will ALWAYS be 0
wikiNs.addRoom(new Room("rm-1", "New Articles", "Wiki"));
wikiNs.addRoom(new Room("rm-2", "Editors", "Wiki", true));
wikiNs.addRoom(new Room("rm-3", "Other", "Wiki"));

mozNs.addRoom(new Room("rm-4", "Firefox", "Mozilla"));
mozNs.addRoom(new Room("rm-5", "SeaMonkey", "Mozilla"));
mozNs.addRoom(new Room("rm-6", "SpiderMonkey", "Mozilla", true));
mozNs.addRoom(new Room("rm-7", "Rust", "Mozilla"));

linuxNs.addRoom(new Room("rm-8", "Debian", "Linux"));
linuxNs.addRoom(new Room("rm-9", "Red Hat", "Linux"));
linuxNs.addRoom(new Room("rm-10", "MacOs", "Linux", true));
linuxNs.addRoom(new Room("rm-11", "Kernal Development", "Linux"));

module.exports = namespaces;

const { Server } = require("socket.io");
const http = require("http");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
};

const getSocket = () => {
  if (!io) {
    throw new Error("Socket not initialized!");
  }
  return io;
};

module.exports = {
  initSocket,
  getSocket,
};

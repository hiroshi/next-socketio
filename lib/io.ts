import type { Server } from 'socket.io';

declare global {
  namespace globalThis {
    var _io: Server;
  }
}

function io() {
  return global._io;
}

function setIo(io: Server) {
  return global._io = io;
}

export { io, setIo };

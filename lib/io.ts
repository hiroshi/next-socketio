function io() {
  return global._io;
}

function setIo(io) {
  return global._io = io;
}

export { io, setIo };

import { Server } from 'socket.io';
import { io, setIo } from '../../lib/io'

export default async function handler(req, res) {
  // console.log('/api/socket');
  if (!io()) {
    const httpServer = res.socket.server;
    const io = new Server(httpServer);
    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      // socket.emit('serverMessage', 'hello');

      socket.onAny((event, message) => {
        console.log(`from client: ${event}: ${message}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
    setIo(io);
  }
  res.end();
}

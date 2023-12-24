// import { PORT } from "@/config/app"
// import type { Server as HTTPServer } from "http"
// import type { Socket as NetSocket } from "net"
// import type { NextApiRequest, NextApiResponse } from "next"
// import type { Server as IOServer } from "socket.io"
// import { Server } from "socket.io"

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// interface SocketServer extends HTTPServer {
//   io?: IOServer | undefined
// }

// interface SocketWithIO extends NetSocket {
//   server: SocketServer
// }

// interface NextApiResponseWithSocket extends NextApiResponse {
//   socket: SocketWithIO
// }
// export default function SocketHandler(_req: NextApiRequest, res: NextApiResponseWithSocket) {
//   if (res.socket.server.io) {
//     res.status(200).json({ success: true, message: "Socket is already running", socket: `:${PORT + 1}` })
//     return
//   }

//   console.log("Starting Socket.IO server on port:", PORT + 1)
//   //@ts-expect-error
//   const io = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" } }).listen(PORT + 1)

//   io.on("connect", socket => {
//     const _socket = socket
//     console.log("socket connect", socket.id)
//     _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`)
//     socket.on("disconnect", async () => {
//       console.log("socket disconnect")
//     })
//   })

//   res.socket.server.io = io
//   res.status(201).json({ success: true, message: "Socket is started", socket: `:${PORT + 1}` })
// }


import { Server } from 'socket.io';

export default async function handler(req, res) {
  console.log('/api/socket');
  if (!res.socket.server.io) {
    const httpServer = res.socket.server;
    const io = new Server(httpServer);
    // const io = new Server(httpServer, {path: '/api/socket', addTrailingSlash: false});
    io.on('connection', (socket) => {
      console.log('Client connected');
      socket.emit('serverMessage', 'hello');

      socket.on('chatMessage', (message) => {
        console.log(`Client says: ${message}`);
      });

      socket.onAny((event, message) => {
        console.log(`Client says: ${event} ${message}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
    res.socket.server.io = io;
  }
  res.end();
}

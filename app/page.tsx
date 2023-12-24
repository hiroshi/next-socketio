'use client'

import { useEffect, useState } from 'react';
// import SocketClient from "socketClient";
import io from 'socket.io-client';

export default function Page() {
  // const [message, setMessage] = useState();
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const socket = io();
    console.log("emit message")
    socket.emit('chatMessage', 'Hello, server!');
    const ack = await socket.emitWithAck('chatMessage', 'Hello, server!');
    console.log(`ack: ${ack}`);
  };

  useEffect(() => {
    fetch('/api/socket').then(() => {
      const sock = io();
    // const socket = io(':3000', {path: '/api/socket', addTrailingSlash: false});
      sock.on('serverMessage', (message) => {
        console.log(`Server says: ${message}`);
      });
      setSocket(sock);
    });
    // console.log("emit message")
    // socket.emit('chatMessage', 'Hello, server!');

    return () => {
      if (socket !== undefined) {
        socket.disconnect();
      }
    };
  }, []);


  return (
    <div>
      <h1>Hello, Next.js!</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" />
      </form>
    </div>
  );
}

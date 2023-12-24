'use client'

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function Page() {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("emit message")
    socket.emit('clientMessage', 'Hello, server!');
  };

  useEffect(() => {
    fetch('/api/socket').then(() => {
      const sock = io();
      setSocket(sock);
    });

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

'use client'

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

export default function Page() {
  const inputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = inputRef.current.value;
    socket.emit('clientMessage', message);
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
        <input type="text" ref={inputRef} />
      </form>
    </div>
  );
}

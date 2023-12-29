'use client'

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { SessionProvider } from "next-auth/react";
import { useSession, signIn, signOut } from "next-auth/react";

function CurrentUser() {
  const { data: session, status } = useSession();
  console.log("status:", status);
  console.log("session:", session);

  if (session) {
    return (
      <>
        email: {session.user.email}<br/>
        <button onClick={signOut}>Sign out</button>
      </>
    );
  } else {
    return (
      <>
        <button onClick={signIn}>Sign in</button>
      </>
    );
  }
}

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
    <SessionProvider>
      <h1>Hello, Next.js!</h1>
      <CurrentUser />
      <form onSubmit={handleSubmit}>
        <input type="text" ref={inputRef} />
      </form>
    </SessionProvider>
  );
}

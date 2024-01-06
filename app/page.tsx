'use client'

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { SessionProvider } from "next-auth/react";
import { useSession, signIn, signOut } from "next-auth/react";

function CurrentUser() {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <>
        <img src={ session.user.image } width="32" />
        {session.user.email}<br/>
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

function NewTopic({ setUpdate }) {
  const inputRef = useRef(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = inputRef.current.value;
    const res = await fetch('/api/topics', {
      method: 'POST',
      body: JSON.stringify({message}),
    });
    e.target.reset();
    setUpdate(new Date());
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
    </form>
  );
}

function Topics() {
  const [update, setUpdate] = useState(new Date());
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch('/api/topics').then(r => r.json()).then(topics => {
      setTopics(topics);
    });
  }, [update]);

  useEffect(() => {
    const socket = io();
    socket.on('connect_error', (error) => {
      console.log('socket connect_error:', error);
      fetch('/api/socket');
    });
    // socket.onAny((event, ...args) => {
    //   console.log('socket.onAny:', { event, args })
    // });
    socket.on('topics', setTopics);
  }, []);

  const items = topics.map(topic => {
    const user = topic.user
    return (
      <li key={topic._id}>
        <img src={user.image} width="16" title={user.email} alt={user.email} />
        {topic.message}
      </li>
    );
  });

  const newTopicsProps = { setUpdate };
  return (
    <div>
      <form>
      </form>
      <ul>
        <li>
          <NewTopic {...newTopicsProps}/>
        </li>
        { items }
      </ul>
    </div>
  );
}

export default function Page() {
  const inputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState();
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const message = inputRef.current.value;
  //   socket.emit('clientMessage', message);
  // };

  // useEffect(() => {
  //   fetch('/api/socket').then(() => {
  //     const sock = io();
  //     setSocket(sock);
  //   });

  //   return () => {
  //     if (socket !== undefined) {
  //       socket.disconnect();
  //     }
  //   };
  // }, []);

      // <hr/>
      // socket.io test
      // <form onSubmit={handleSubmit}>
      //   <input type="text" ref={inputRef} />
      // </form>

  return (
    <SessionProvider>
      <CurrentUser />
      <hr/>
      <Topics />
    </SessionProvider>
  );
}

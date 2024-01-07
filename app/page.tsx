'use client'

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { SessionProvider } from "next-auth/react";
import { useSession, signIn, signOut } from "next-auth/react";

import { Topic } from '../types';

function CurrentUser() {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <>
        <img src={ session?.user?.image || undefined } width="32" />
        {session?.user?.email}<br/>
        <button onClick={ () => signOut() }>Sign out</button>
      </>
    );
  } else {
    return (
      <>
        <button onClick={ () => signIn() }>Sign in</button>
      </>
    );
  }
}

type NewTopicProps = {
  setUpdate: (v: any) => void,
  parent: Topic,
};

function NewTopic({ setUpdate, parent } : NewTopicProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputRef?.current?.value;
    const parent_id = parent?._id;
    const res = await fetch('/api/topics', {
      method: 'POST',
      body: JSON.stringify({ message, parent_id }),
    });
    (e.target as HTMLFormElement).reset();
    setUpdate(new Date());
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
    </form>
  );
}

function TopicItem({ topic }: { topic: Topic }) {
  const [focus, setFocus] = useState(false);

  const handleClick = (e) => {
    setFocus(true);
  };

  const user = topic.user;
  return (
    <div className={'topic-item'} onClick={handleClick}>
      <img src={user.image} width="16" title={user.email} alt={user.email} />
      {topic.message}
      { focus && (
        <TopicsList parent={topic} />
      )}
    </div>
  );
}

function TopicsList({ parent }: { parent: Topic }) {
  const [update, setUpdate] = useState(new Date());
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    let queryString = '';
    if (parent) {
      queryString = new URLSearchParams({ parent_id: parent?._id || null }).toString();
    }
    fetch(`/api/topics?${queryString}`).then(r => r.json()).then(topics => {
      setTopics(topics);
    });
  }, [update]);

  if (!parent) {
    // useEffect(() => {
    //   const socket = io();
    //   socket.on('connect_error', (error) => {
    //     console.log('socket connect_error:', error);
    //     fetch('/api/socket');
    //   });
    //   // socket.onAny((event, ...args) => {
    //   //   console.log('socket.onAny:', { event, args })
    //   // });
    //   socket.on('topics', setTopics);
    // }, []);
  }

  const items = topics.map((topic: Topic) => {
    return (<li key={topic._id}><TopicItem topic={topic} /></li>);
  });

  const newTopicsProps: NewTopicProps = { setUpdate, parent };
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
  return (
    <SessionProvider>
      <CurrentUser />
      <hr/>
      <TopicsList parent={null} />
    </SessionProvider>
  );
}

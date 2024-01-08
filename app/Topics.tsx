'use client'

import { useEffect, useState, useRef, useContext, createContext } from 'react';
import io from 'socket.io-client';
import { SessionProvider } from "next-auth/react";
import Link from 'next/link';

import { Topic } from '../types';

export const SelectedTopicContext = createContext({
  selectedTopic: null,
  setSelectedTopic: () => {},
});

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
    await fetch('/api/topics', {
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
  const [copied, setCopied] = useState(false);
  const { selectedTopic, setSelectedTopic } = useContext(SelectedTopicContext);

  const handleClick = (e) => {
    setFocus(true);
    setSelectedTopic(topic);
  };

  const handleClickMove = async (e) => {
    e.stopPropagation();
    await fetch('/api/topics', {
      method: 'POST',
      body: JSON.stringify({ parent_id: selectedTopic?._id || null, _id: topic._id }),
    });
    // setUpdate(new Date());
  };

  const user = topic.user;
  return (
    <div className={'topic-item'} onClick={handleClick}>
      <img src={user.image} width="16" title={user.email} alt={user.email} />
      <Link href={`/${topic._id}`} onClick={(e) => e.stopPropagation()}>{topic.message}</Link>
      <span className={'topic-action'}>
        { selectedTopic &&
          <button onClick={handleClickMove}>move</button>
        }
      </span>
      { focus && (
        <>
          <TopicsList parent={topic} />
        </>
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
          <span><NewTopic {...newTopicsProps}/></span>
        </li>
        { items }
      </ul>
    </div>
  );
}

export default function Topics( { parent } ) {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <SelectedTopicContext.Provider value={{ selectedTopic, setSelectedTopic }}>
      <p>{ `selectedTopic._id: ${selectedTopic?._id}` }</p>
      <p><Link href={`/${parent?.parent_id || ''}`}>[../]</Link> / {parent?.message}</p>
      <TopicsList parent={ parent } />
    </SelectedTopicContext.Provider>
  );
}

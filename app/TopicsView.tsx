'use client'

import { useEffect, useState, useRef } from 'react';

type NewTopicProps = {
  setUpdate: (v: any) => void,
};

function NewTopic({ setUpdate } : NewTopicProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputRef?.current?.value;
    await fetch('/api/topics', {
      method: 'POST',
      body: JSON.stringify({ message }),
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

function TopicItem({ topic, selected }: { topic: Topic, selected: bool }) {
  return (
    <div className={selected && 'topic-selected'}>{topic.message}</div>
  );
}

export default function TopicsView() {
  const [update, setUpdate] = useState(new Date());
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(new Date());
  const listRef = useRef(null);

  useEffect(() => {
    fetch('/api/topics?limit=1').then(r => r.json()).then(topics => {
      setTopics(topics);
    });
  }, [update]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setSelectedTopicId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const items = topics.map((topic: Topic) => {
    const props = {
      topic: topic,
      selected: selectedTopicId === topic._id,
    }
    return (<li key={topic._id} onClick={()=>setSelectedTopicId(topic._id)}><TopicItem {...props} /></li>);
  });

  const newTopicsProps: NewTopicProps = { setUpdate };
  return (
    <div>
      <form>
        <input type='text' />
      </form>
      <ul ref={listRef}>
        <li>
          <NewTopic {...newTopicsProps} />
        </li>
        { items }
      </ul>
    </div>
  );
}

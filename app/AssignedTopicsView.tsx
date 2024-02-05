'use client'

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { TopicItem, TopicsViewContext } from './TopicsView';

export default function AssignedTopicsView() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topics, setTopics] = useState({items:[], total:0});
  const listRef = useRef(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const assignee = session.user._id;
      fetch(`/api/topics?assignee=${assignee}`).then(r => r.json()).then(topics => {
        // console.log("assigned topics:", topics);
        setTopics(topics);
      });
    }
  }, [session]);

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

  const context = {
    updateView: () => {},
    setSelectedTopicId,
  }

  const items = topics.items.map(topic => {
    const props = {
      topic: topic,
      selected: selectedTopicId === topic._id,
    }
    return (
      <li key={topic._id} onClick={()=>setSelectedTopicId(topic._id)}>
        <TopicItem {...props} />
      </li>
    );
  });

  return (
    <TopicsViewContext.Provider value={context}>
      <ul ref={listRef}>
        { items }
      </ul>
    </TopicsViewContext.Provider>
  );
}

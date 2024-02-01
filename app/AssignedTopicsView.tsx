'use client'

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

export default function AssignedTopicsView() {
  const [ topics, setTopics ] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const assignee = session.user._id;
      fetch(`/api/topics?assignee=${assignee}`).then(r => r.json()).then(topics => {
        console.log("assigned topics:", topics);
        setTopics(topics);
      });
    }
  }, [session]);

  const items = topics.map(topic => {
    return (
      <li key={topic._id}>
        { topic.message }
      </li>
    );
  });

  return (
    <ul>{ items }</ul>
  );
}

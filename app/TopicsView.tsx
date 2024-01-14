'use client'

import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';

function Filter() {
  const [filterString, setFilterString] = useState('');

  const handleChange = async (event) => {
    const value = event.target.value
    setFilterString(value);
    // console.log(value);
    const results = await fetch(`/api/labels?q=${value}`).then(r => r.json())
    console.log(results);
  };

  return (
    <form>
      <input type='text' value={filterString} onChange={handleChange} />
    </form>
  );
}

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

function TopicItem({ topic, selected, setUpdate }: { topic: Topic, selected: bool, setUpdate: (v: any) => void }) {
  const initialLabelsString = topic.labels ? topic.labels.map((o) => `${o.k}:${o.v}`).join(' ') : '';

  const [labelsString, setLabelsString] = useState(initialLabelsString);

  const handleChangeLabels = (e) => {
    setLabelsString(e.target.value);
  };

  const handleSubmitLabels = async (e) => {
    e.preventDefault();
    await fetch('/api/topics', {
      method: 'POST',
      body: JSON.stringify({ _id: topic._id, labels }),
    });
    console.log(labels);
    // (e.target as HTMLFormElement).reset();
    setUpdate(new Date());
  };

  const labels = [];
  labelsString.split(/\s+/).forEach((pair) => {
    const [k, v] = pair.split(':');
    if (k && v) {
      labels.push({k,v});
    }
  });

  return (
    <div className={classNames({'topic-item': true, 'topic-selected': selected})}>
      {topic.message}
      {
        labels.map((o, i) => <span key={i} className='topic-label'>{`${o.k}:${o.v}`}</span>)
      }
      { selected &&
        <span>
          <form onSubmit={handleSubmitLabels} className='topic-labels-form'>
            <input type='text' value={labelsString} onChange={handleChangeLabels} />
          </form>
        </span>
      }
    </div>
  );
}

export default function TopicsView() {
  const [update, setUpdate] = useState(new Date());
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(new Date());
  const listRef = useRef(null);

  useEffect(() => {
    fetch('/api/topics?limit=3').then(r => r.json()).then(topics => {
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
      setUpdate,
    }
    return (<li key={topic._id} onClick={()=>setSelectedTopicId(topic._id)}><TopicItem {...props} /></li>);
  });

  const newTopicsProps: NewTopicProps = { setUpdate };
  return (
    <div>
      <Filter />
      <ul ref={listRef}>
        <li>
          <NewTopic {...newTopicsProps} />
        </li>
        { items }
      </ul>
    </div>
  );
}

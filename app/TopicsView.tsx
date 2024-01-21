'use client'

import { useEffect, useState, useRef, useContext, createContext } from 'react';
import classNames from 'classnames';

const TopicsViewContext = createContext({
  updateView: () => {},
  setSelectedTopicId: () => {},
});

function Filter({ setQuery }) {
  const [filterString, setFilterString] = useState('');
  const [labels, setLabels] = useState([]);
  const [focusLabel, setFocusLabel] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch(`/api/labels?q=${filterString}`).then(r => r.json()).then((results) => {
      console.log('results:', results);
      setLabels(results);
    });
  }, [filterString]);

  const handleChange = async (event) => {
    const value = event.target.value
    setFilterString(value);
    // console.log(value);
  };

  const handleFocus = (event) => {
    const value = event.target.value;
    const [k, _v] = value.split(':');
    const v = _v !== '' ? _v : undefined;
    // console.log('handleFocus:', [k, v !== '' ? v : null]);
    setFocusLabel({k, v});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('submit:', focusLabel);
    // setFilterString(focusLabel + ':');
    if (focusLabel) {
      const {k, v} = focusLabel;
      if (v !== undefined) {
        const filterString = `${k}:${v}`;
        setFilterString(filterString);
        setQuery(filterString);
        setFocusLabel(null);
      } else {
        setFilterString(`${k}:`);
      }
    } else {
      setQuery(filterString);
    }
    inputRef.current.focus();
  };

  const options = labels.map(({k, v}) => {
    const label = v !== undefined ? `${k}:${v}` : `${k}:`
    return (<button key={ label } value={ label } onFocus={handleFocus}>{ label }</button>);
  });

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type='text' value={filterString} onChange={handleChange} />
      { options }
    </form>
  );
}

function NewTopic() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const { updateView } = useContext(TopicsViewContext);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = inputRef?.current?.value;
    await fetch('/api/topics', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    (e.target as HTMLFormElement).reset();
    updateView();
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
  const { updateView, setSelectedTopicId } = useContext(TopicsViewContext);

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
    // setUpdate(new Date());
    updateView();
    setSelectedTopicId(null);
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
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [query, setQuery] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    fetch(`/api/topics?limit=3&q=${query}`).then(r => r.json()).then(topics => {
      setTopics(topics);
    });
  }, [update, query]);

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

  const context = {
    updateView: () => setUpdate(new Date()),
    setSelectedTopicId,
  }

  const filterProps = { setQuery };
  return (
    <TopicsViewContext.Provider value={context}>
      <Filter {...filterProps}/>
      <ul ref={listRef}>
        <li>
          <NewTopic />
        </li>
        { items }
      </ul>
    </TopicsViewContext.Provider>
  );
}

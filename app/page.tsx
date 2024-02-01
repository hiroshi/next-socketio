// import Topics from './Topics';
import FilterTabsView from './FilterTabsView';
import AssignedTopicsView from './AssignedTopicsView';
import TopicsView from './TopicsView';

export default function Page() {
  return (
    <>
      <AssignedTopicsView />
      <hr/>
      <FilterTabsView />
      <p/>
      <TopicsView />
    </>
  );
}

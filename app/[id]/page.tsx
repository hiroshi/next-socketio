// import { useEffect } from 'react';

import Topics from '../Topics';

import { collection } from '../../lib/mongo';
import { ObjectId } from 'mongodb';

export default async function Page(args) {
  // console.log(args);
  const { params: { id } } = args;

  // useEffect(async () => {
  const Topic = await collection('topics');
  const topic = JSON.parse(JSON.stringify(await Topic.findOne({ _id: new ObjectId(id) })))
  // console.log({ topic });
  // }, []);

  return (
    <Topics parent={ topic } />
  );
};

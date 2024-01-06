import { NextResponse } from 'next/server';
import { collection } from '../../../lib/mongo';
import { io } from '../../../lib/io';

async function topics() {
  const Topic = await collection('topics');
  const User = await collection('users');

  const topics = await Topic.find().sort({ _id: -1 }).toArray();
  for (var topic of topics) {
    const user = await User.findOne({_id: topic.user_id});
    if (user) {
      topic.user = user;
    }
  }
  return topics;
}

async function GET(req: Request) {
  return NextResponse.json(await topics());
}

import { getServerSession } from "next-auth";
import authOptions  from "../auth/[...nextauth]/authOptions";

async function POST(req: Request) {
  const topic = await req.json();
  const Topic = await collection('topics');
  const User = await collection('users');

  const session = await getServerSession(authOptions) as any;;
  // console.log('POST /api/topics', { session });
  const uid = session?.user?.id;
  const user = await User.findOne({ uid });
  const user_id = user?._id;
  await Topic.insertOne({ ...topic, user_id });

  io().emit('topics', await topics())

  return new Response('', { status: 201 });
}

export { GET, POST };

import { NextResponse } from 'next/server';
import { collection } from '../../../lib/mongo';

async function GET(req: Request) {
  const Topic = await collection('topics');
  const User = await collection('users');

  const topics = await Topic.find().toArray();
  for (var topic of topics) {
    const user = await User.findOne({_id: topic.user_id});
    if (user) {
      topic.user_image = user.image;
    }
  }
  return NextResponse.json(topics);
}

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

async function POST(req: Request) {
  const topic = await req.json();
  const Topic = await collection('topics');
  const User = await collection('users');

  const session = await getServerSession(authOptions);
  // console.log('POST /api/topics', { session });
  const uid = session.user.id;
  const user = await User.findOne({ uid });
  const user_id = user._id;
  await Topic.insertOne({ ...topic, user_id });

  return new Response('', { status: 201 });
}

export { GET, POST };

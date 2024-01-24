import { NextResponse } from 'next/server';
import { collection } from '../../../lib/mongo';
import { io } from '../../../lib/io';
import { ObjectId } from 'mongodb';

async function topics(query, limit) {
  const Topic = await collection('topics');
  const User = await collection('users');

  // console.log('topics:', query);
  const topics = await Topic.find(query).sort({ _id: -1 }).limit(Number(limit)).toArray();
  for await (const topic of topics) {
    const user = await User.findOne({_id: topic.user_id});
    if (user) {
      topic.user = user;
    }
  }
  return topics;
}

async function GET(req: Request) {
  // const { parent_id } = await req.json();
  const searchParams = req.nextUrl.searchParams;
  console.log('GET /api/topics:', searchParams);
  const limit = searchParams.get('limit');
  // const parent_id = searchParams.get('parent_id');
  // const query = {
  //   parent_id: parent_id ? new ObjectId(parent_id) : null,
  // };
  const q = searchParams.get('q');
  // console.log('q:', q);
  const query = {};
  q.split(/\s+/).forEach((label) => {
    const [k, v] = label.split(':');
    // console.log('label:', label, {k, v});
    if (v) {
      query['labels'] = { k, v };
    }
  })
  return NextResponse.json(await topics(query, limit));
}

import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/authOptions";

async function POST(req: Request) {
  const params = await req.json();
  console.log('POST /api/topics:', params);
  const { _id, message, parent_id, labels } = params;
  const Topic = await collection('topics');
  const User = await collection('users');

  if (_id) {
    // await Topic.updateOne({_id: new ObjectId(_id)}, { $set: { parent_id: new ObjectId(parent_id) } });
    await Topic.updateOne({_id: new ObjectId(_id)}, { $set: { labels: labels } });
    return new Response(null, { status: 204 });
  } else {
    const session = await getServerSession(authOptions) as any;;
    // console.log('POST /api/topics', { session });
    const uid = session?.user?.id;
    const user = await User.findOne({ uid });
    const user_id = user?._id;
    const doc = { message, user_id, labels };
    if (parent_id) {
      doc.parent_id = new ObjectId(parent_id);
    }
    await Topic.insertOne(doc);

    // io().emit('topics', await topics())

    return new Response('', { status: 201 });
  }
}

export { GET, POST };

import { NextResponse } from 'next/server';
import { collection } from '../../../lib/mongo'

export async function GET(request: Request) {
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


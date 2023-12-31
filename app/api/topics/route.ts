import { NextResponse } from 'next/server';
import mongoClientPromise from '../../../lib/mongo'

export async function GET(request: Request) {
  const mongoClient = await mongoClientPromise;
  const topics = mongoClient.db('topics').collection('topics');
  return NextResponse.json(await topics.find().toArray());
}


import { NextResponse } from 'next/server';
import mongoClient from '../../../lib/mongo'

export async function GET(request: Request) {
  const topics = mongoClient.db('topics').collection('topics');
  return NextResponse.json(await topics.find().toArray());
}


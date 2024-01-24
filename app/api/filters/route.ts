import { NextResponse } from 'next/server';

import { collection } from '../../../lib/mongo';

async function GET(req: Request) {
  console.log('GET /api/filters');
  const Filter = await collection('filters');
  const filters = await Filter.find().toArray();
  // console.log('filters:', filters);

  return NextResponse.json(filters);
}

async function POST(req: Request) {
  const params = await req.json();
  console.log('POST /api/filters:', params);
  const { labels } = params;

  const Filter = await collection('filters');
  const filter = { labels };
  await Filter.updateOne(filter, {$set: filter}, { upsert: true });

  return new Response('', { status: 201 });
}


export { GET, POST };

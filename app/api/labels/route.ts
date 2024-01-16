import { NextResponse } from 'next/server';

import { collection } from '../../../lib/mongo';

async function GET(req: Request) {
  const searchParams = req.nextUrl.searchParams;
  console.log('GET /api/labels:', searchParams);
  const q = searchParams.get('q');
  const [k, v] = q.split(':');

  const Topic = await collection('topics');
  const labels = await Topic.distinct('labels.k', {'labels.k': {$regex: `^${k}`}});
  console.log(labels);

  return NextResponse.json(labels);

}

export { GET };

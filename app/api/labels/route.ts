import { NextResponse } from 'next/server';

import { collection } from '../../../lib/mongo';

async function GET(req: Request) {
  const searchParams = req.nextUrl.searchParams;
  console.log('GET /api/labels:', searchParams);
  const q = searchParams.get('q');
  const [k, v] = q.split(':');
  // console.log(`${k}:${v}`);

  const Topic = await collection('topics');
  if (v !== undefined) {
    const labels = await Topic.distinct('labels', {'labels.k': k, 'labels.v': {$regex: `^${v}`}});
    console.log('=>', labels);
    return NextResponse.json(labels);
  } else {
    const keys = await Topic.distinct('labels.k', {'labels.k': {$regex: `^${k}`}});
    // console.log('keys:', keys);
    const labels = keys.map((k) => {return {k}});
    console.log('=>', labels);
    return NextResponse.json(labels);
  }
}

export { GET };

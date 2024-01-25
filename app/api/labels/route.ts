import { NextResponse } from 'next/server';

import { collection } from '../../../lib/mongo';

async function GET(req: Request) {
  const searchParams = req.nextUrl.searchParams;
  console.log('GET /api/labels:', searchParams);
  const q = searchParams.get('q');
  const [k, v] = q.split(':');

  const Topic = await collection('topics');
  const match = (v !== undefined)
    ? {"labels.k": k, "labels.v": {$regex: `^${v}`}}
    : {"labels.k": {$regex: `^${k}`}};
  const labels = await Topic.aggregate([
    { $unwind: "$labels" },
    { $match: match },
    { $group: { _id: "$labels" } },
    { $project: { _id: 1 } }
  ]).toArray().then(results => results.map(l => l._id));
  console.log('=>', labels);
  return NextResponse.json(labels);
}

export { GET };

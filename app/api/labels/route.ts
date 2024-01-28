import { NextResponse } from 'next/server';

import { collection } from '../../../lib/mongo';

async function GET(req: Request) {
  const searchParams = req.nextUrl.searchParams;
  console.log('GET /api/labels:', searchParams);
  const q = searchParams.get('q');
  const [k, v] = q.split(':');

  const Topic = await collection('topics');

  let labels;
  if (v !== undefined) {
    labels = await Topic.aggregate([
      { $unwind: "$labels" },
      { $match: {"labels.k": k, "labels.v": {$regex: `^${v}`}}},
      { $group: { _id: "$labels" } },
    ]).toArray().then(results => results.map(l => l._id));
  } else {
    labels = await Topic.aggregate([
      { $unwind: "$labels" },
      { $match: {"labels.k": {$regex: `^${k}`}} },
      { $group: { _id: "$labels.k" } },
    ]).toArray().then(results => results.map(l => { return {k: l._id}}));
  }
  console.log('=>', labels);
  return NextResponse.json(labels);
}

export { GET };

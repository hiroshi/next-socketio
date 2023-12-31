import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
const serverApi = ServerApiVersion.v1;

export async function GET(request: Request) {
  if (!global.mongoClientPromise) {
    const client = new MongoClient('mongodb://mongo:27017/', { serverApi } )
    // console.log("mongoClient: ", client);
    global.mongoClientPromise = client.connect();
  }
  const client = await global.mongoClientPromise;
  const collection = client.db('topics').collection('topics');
  return NextResponse.json(await collection.find().toArray());
}


import { MongoClient, ServerApiVersion } from 'mongodb';

if (!global.mongoClien) {
  const serverApi = ServerApiVersion.v1;
  const client = new MongoClient('mongodb://mongo:27017/', { serverApi } )
  global.mongoClient = await client.connect();
}
const db = global.mongoClient.db('topics');
export default db;

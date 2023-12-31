import { MongoClient, ServerApiVersion } from 'mongodb';
const serverApi = ServerApiVersion.v1;

if (!global.mongoClientPromise) {
  const client = new MongoClient('mongodb://mongo:27017/', { serverApi } )
  global.mongoClientPromise = client.connect();
}
export default global.mongoClientPromise;

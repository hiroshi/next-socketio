import { MongoClient, ServerApiVersion } from 'mongodb';
const serverApi = ServerApiVersion.v1;

if (!global.mongoClien) {
  const client = new MongoClient('mongodb://mongo:27017/', { serverApi } )
  global.mongoClient = await client.connect();
}
export default global.mongoClient;

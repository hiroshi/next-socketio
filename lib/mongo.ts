import { MongoClient, ServerApiVersion } from 'mongodb';

// https://stackoverflow.com/a/74083358/338986
declare global {
  namespace globalThis {
    var mongoClient: MongoClient;
  }
}

const collection = async (collection: string) => {
  if (!global.mongoClient) {
    const serverApi = ServerApiVersion.v1;
    global.mongoClient = new MongoClient('mongodb://mongo:27017/', { serverApi } )
  }
  const conn = await global.mongoClient.connect();
  return conn.db('topics').collection(collection);
};

const close = () => {
  if (global.mongoClient) {
    global.mongoClient.close();
  }
};

export { collection, close };

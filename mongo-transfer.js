const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const originMongoUrl = 'mongodb://35.174.168.103:27017';
const originDb = 'synthea-modules';
const originCollection = 'module';
const destMongoUrl = 'mongodb://admin:admin123@ds251245.mlab.com:51245/proxi-modules';
const destDb = 'proxi-modules';
const destCollection = 'module';

(async function() {
  const origin_client = new MongoClient(originMongoUrl);
  const dest_client = new MongoClient(destMongoUrl);

  try {
    await origin_client.connect();
    console.log("Connected to origin server");

    const origin_db = origin_client.db(originDb);
    const origin_collection = origin_db.collection(originCollection);

    let originDocs = await origin_collection.find({}).toArray();
    console.log('Pulled ' + originDocs.length + ' docs from origin server');

    await dest_client.connect();
    console.log("Connected to destination server");

    const dest_db = dest_client.db(destDb);
    const dest_collection = dest_db.collection(destCollection);

    const insertResult = await dest_collection.insertMany(originDocs);
    console.log("Inserted " + insertResult.insertedCount + " to destination db");
    assert.equal(insertResult.insertedCount, originDocs.length);

  } catch (err) {
    console.log(err.stack);
  }

  // Close connection
  origin_client.close();
  dest_client.close();
})();
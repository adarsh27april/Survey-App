const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017'
const dbName = 'survey_response';
const collectionName = "response";

const client = new MongoClient(uri, { useUnifiedTopology: true })

async function connect_mongoDB() {
   try {
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db(dbName).command({ ping: 1 });
      console.log(`connection to db '${dbName}' success`);

   } catch (error) {
      console.log('some error: ', error);
   }
   finally {
      // Ensures that the client will close when you finish/error
      await client.close();
   }
}
async function addSurveyResponse(response) {
   try {
      await client.connect();

      const result = await client.db(dbName).collection(collectionName).insertOne(response);
      console.log('new entry in db with id : ', result);
   } catch { (error) => console.log('some error: ', error) }

   finally { await client.close(); }
}

async function getAllSurveyResponses() {
   try {
      await client.connect()

      const allResponses = await client.db(dbName).collection(collectionName).find().toArray();
      return allResponses;
   } catch { (err) => console.log('some err: ', err) }
   finally { await client.close(); }
}

async function getSingleSurveyResponse(objectToBeFound) {
   try {
      await client.connect()

      const result = await client.db(dbName).collection(collectionName).findOne(objectToBeFound)
      return result;
   } catch { (err) => console.log('some err: ', err) }
   finally { await client.close(); }
}
async function deleteSingleSurveyResponse(objectToBeDeleted) {
   try {
      await client.connect()

      const result = await client.db(dbName).collection(collectionName).deleteOne(objectToBeDeleted)
      return result;
   } catch { (err) => console.log('some err: ', err) }
   finally { await client.close(); }
}
module.exports = {
   connect_mongoDB,
   addSurveyResponse,
   getAllSurveyResponses,
   getSingleSurveyResponse,
   deleteSingleSurveyResponse
}

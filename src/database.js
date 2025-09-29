
const { MongoClient } = require("mongodb");
const URI = "mongodb+srv://srishti_2398:u5iWxrhG99bnYU8b@cluster0.rhenuza.mongodb.net/";

const client = new MongoClient(URI);

const dbName = "HelloWorld";

async function main () {
    await client.connect();
    console.log("Connected Successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("User");

    const data = {
        firstname: "Vidhi",
        lastname:"Pandey",
        city:"Mumbai",
        contact_number:"0899776567"

    }

    //const insertResult = await collection.insertMany([data]);
   // console.log('Insert document=>',insertResult)

    const FindResult = await collection.find({}).toArray();
    console.log('found document =>',FindResult)

    const countResult = await collection.countDocuments({});
    console.log("count of document in the user collection =>",countResult)



    return "done";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
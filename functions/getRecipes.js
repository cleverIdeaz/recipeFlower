// functions/getRecipes.js
const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  const uri = "your-mongodb-connection-string"; // Place your MongoDB connection string here
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("your-database-name");
    const recipes = database.collection("recipes");
    const results = await recipes.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch recipes" }),
    };
  } finally {
    await client.close();
  }
};
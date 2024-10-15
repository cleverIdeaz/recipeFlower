const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  const uri = "mongodb+srv://nealandersontech:lbfVgSputI7qEgke@recipeflower.2aa68.mongodb.net/?retryWrites=true&w=majority&appName=recipeflower";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("recipeflower");
    const recipes = database.collection("Recipes");
    const results = await recipes.find({}).toArray();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins (modify if necessary)
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET', // Specify allowed methods
      },
      body: JSON.stringify(results),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: "Failed to fetch recipes", details: error.message }),
    };
  } finally {
    await client.close();
  }
};
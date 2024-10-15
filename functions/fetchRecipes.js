// functions/getRecipes.js
const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  const uri = "mongodb+srv://nealandersontech:lbfVgSputI7qEgke@recipeflower.2aa68.mongodb.net/?retryWrites=true&w=majority&appName=recipeflower"; // Update with your connection string
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("recipeflower"); // Make sure this matches your database name
    const recipes = database.collection("Recipes"); // Ensure the collection name is correct
    const results = await recipes.find({}).toArray(); // Fetch all documents

    console.log('Fetched results:', results); // Log the fetched results

    return {
      statusCode: 200,
      body: JSON.stringify(results), // Return the fetched results
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch recipes", details: error.message }), // Log the error message
    };
  } finally {
    await client.close(); // Ensure the client is closed after operation
  }
};
// functions/fetchRecipes.js
const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  // Use your actual connection string here
  const uri = "mongodb+srv://nealandersontech:lbfVgSputI7qEgke@recipeflower.2aa68.mongodb.net/recipeflower?retryWrites=true&w=majority"; // Ensure 'recipeflower' is included after the last '/'
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("recipeflower"); // Ensure this is your correct database name
    const recipes = database.collection("Recipes"); // Ensure this matches your collection name
    const results = await recipes.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching recipes:', error); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch recipes", details: error.message }), // Include details
    };
  } finally {
    await client.close();
  }
};
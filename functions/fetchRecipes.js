// functions/getRecipes.js
const { MongoClient } = require("mongodb");

exports.handler = async (event, context) => {
  const uri = "mongodb+srv://nealandersontech:lbfVgSputI7qEgke@recipeflower.2aa68.mongodb.net/?retryWrites=true&w=majority&appName=recipeflower";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("RecipeFlower");
    const recipes = database.collection("Recipes");
    // const recipes = database.collection("RecipeFlower");

    const results = await recipes.find({}).toArray();
    
    console.log('Retrieved recipes:', results); // Log the retrieved recipes

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching recipes:', error); // Log any errors that occur
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
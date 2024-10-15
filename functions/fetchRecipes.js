const { MongoClient } = require("mongodb");

exports.handler = async  (event, context) => {
  const uri = "mongodb+srv://nealandersontech:<db_password>@recipeflower.2aa68.mongodb.net/recipeflower?retryWrites=true&w=majority&appName=recipeflower"; // Update with your actual password
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("recipeflower"); // Use your database name here
    const recipes = database.collection("recipes");
    const results = await recipes.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching recipes:', error); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch recipes" }),
    };
  } finally {
    await client.close();
  }
};



// getRecipes.js
exports.handler = async function (event, context) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from the function!" }),
    };
  };
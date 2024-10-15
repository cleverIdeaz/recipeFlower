
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://nealandersontech:lbfVgSputI7qEgke@recipeflower.2aa68.mongodb.net/?retryWrites=true&w=majority&appName=recipeflower";



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// above is example code for connecting to the database from mongodb website

// below is code for the backend of the website

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();





const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'https://recipeflower.netlify.app/frontend/'], // Add your Netlify domain here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });





const recipeSchema = new mongoose.Schema({
  Category: String,
  Subcategory: String,
  RecipeName: String,
  Ingredients: String,
  IngredientLinks: String,
  Instructions: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

app.get('/api/recipes', async (req, res) => {
  try {
    console.log('Fetching recipes from database...');
    const recipes = await Recipe.find();
    console.log(`Found ${recipes.length} recipes`);
    const organizedData = recipes.reduce((acc, recipe) => {
      if (!acc[recipe.Category]) {
        acc[recipe.Category] = {};
      }
      if (!acc[recipe.Category][recipe.Subcategory]) {
        acc[recipe.Category][recipe.Subcategory] = [];
      }
      acc[recipe.Category][recipe.Subcategory].push(recipe);
      return acc;
    }, {});
    console.log('Organized data:', JSON.stringify(organizedData, null, 2));
    res.json(organizedData);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
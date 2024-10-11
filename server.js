// Assuming you've already set up the MongoDB connection
const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe'); // Adjust the path to where your schema is defined

const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle JSON
app.use(express.json());

// Route to get all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching recipes' });
  }
});

// Serve your index.html
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
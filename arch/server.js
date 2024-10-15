// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://nealandersontech:lbfVgSputI7qEgke@recipeflower.2aa68.mongodb.net/recipeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const recipeSchema = new mongoose.Schema({
  Category: String,
  Subcategory: String,
  RecipeName: String,
  Ingredients: String,
  IngredientLinks: String,
  Instructions: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Get all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Recipe.distinct('Category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get subcategories by category
app.get('/subcategories/:category', async (req, res) => {
  try {
    const subcategories = await Recipe.distinct('Subcategory', { Category: req.params.category });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

// Get recipes by subcategory
app.get('/recipes/:subcategory', async (req, res) => {
  try {
    const recipes = await Recipe.find({ Subcategory: req.params.subcategory });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

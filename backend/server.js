const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
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
    const recipes = await Recipe.find();
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
    res.json(organizedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
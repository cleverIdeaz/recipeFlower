let recipes = [];

async function fetchRecipes() {
  try {
    const response = await fetch('/.netlify/functions/fetchRecipes');
    if (!response.ok) throw new Error('Failed to fetch recipes');
    const data = await response.json();
    recipes = data;
    displayRecipes();
  } catch (error) {
    console.error(error);
    // Handle error appropriately
  }
}

function displayRecipes() {
  const recipeContainer = document.getElementById('recipeContainer');
  recipeContainer.innerHTML = '';

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.innerHTML = `
      <h3>${recipe.name}</h3>
      <p>${recipe.ingredients.join(', ')}</p>
      <button onclick="viewRecipe('${recipe.id}')">View Recipe</button>
    `;
    recipeContainer.appendChild(card);
  });
}

function viewRecipe(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  const recipeDetails = document.getElementById('recipeDetails');
  recipeDetails.innerHTML = `
    <h2>${recipe.name}</h2>
    <h3>Ingredients:</h3>
    <ul>
      ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
    </ul>
    <h3>Instructions:</h3>
    <p>${recipe.instructions}</p>
  `;
  recipeDetails.style.display = 'block';
}

fetchRecipes();
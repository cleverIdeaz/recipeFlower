let recipes = [];

async function fetchRecipes() {
  try {
    const response = await fetch('/.netlify/functions/fetchRecipes');
    if (!response.ok) throw new Error('Failed to fetch recipes');
    const data = await response.json();
    recipes = data;
    showCategories(); // Update this call to fit into your category logic
  } catch (error) {
    console.error(error);
    // Handle error appropriately
  }
}

function showRecipes(subcategory) {
  const filteredRecipes = recipes.filter(recipe => recipe.subcategory === subcategory);
  
  title.textContent = subcategory;
  content.innerHTML = filteredRecipes
    .map(recipe => `
      <button class="list-item" onclick="showRecipe('${recipe.recipeName}')">
        ${recipe.recipeName}
      </button>
    `).join('');
}
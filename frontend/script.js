let recipes = [];

async function fetchRecipes() {
  try {
    const response = await fetch('http://localhost:3000/api/recipes');
    recipes = await response.json();
    populateRecipeDropdown();
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
}

function populateRecipeDropdown() {
  const select = document.getElementById('recipeSelect');
  recipes.forEach((recipe, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.innerText = recipe.RecipeName;
    select.appendChild(option);
  });
}

function updateRecipeCard() {
  const select = document.getElementById('recipeSelect');
  const selectedIndex = select.value;
  if (selectedIndex === "") {
    return;
  }
  const selectedRecipe = recipes[selectedIndex];
  const recipeDetails = document.getElementById('recipeDetails');
  recipeDetails.innerHTML = `
    <h2>${selectedRecipe.RecipeName}</h2>
    <p><strong>Category:</strong> ${selectedRecipe.Category} | ${selectedRecipe.Subcategory}</p>
    <h3>Ingredients:</h3>
    <ul>
      ${selectedRecipe.Ingredients.split(';').map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}
    </ul>
    <h3>Instructions:</h3>
    <ol>
      ${selectedRecipe.Instructions.split(';').map(instruction => `<li>${instruction.trim()}</li>`).join('')}
    </ol>
  `;
}

document.getElementById('recipeSelect').addEventListener('change', updateRecipeCard);

fetchRecipes();
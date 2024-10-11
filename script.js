let recipes = [];

async function fetchRecipes() {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQIykR7KdX6P2reQQubZVkCoKyvfa3XsHpNuWPKFB12hmJg1fQFtnFRO8rwz8alayn38HiyJTUlenxP/pubhtml';
  
  // Use a CORS proxy if needed
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  const response = await fetch(CORS_PROXY + SHEET_URL);
  
  // Check if the response is OK
  if (!response.ok) {
    console.error('Failed to fetch recipes:', response.statusText);
    return;
  }
  
  try {
    const data = await response.text();
    const rows = data.split('\n').slice(1); // Skip header

    rows.forEach(row => {
      const [category, subcategory, recipeName, ingredients, ingredientLinks, instructions] = row.split(',');
      recipes.push({ category, subcategory, recipeName, ingredients, ingredientLinks, instructions });
    });

    populateRecipeDropdown();
  } catch (error) {
    console.error('Error processing data:', error);
  }
}

function populateRecipeDropdown() {
  const select = document.getElementById('recipeSelect');
  recipes.forEach((recipe, index) => {
    const option = document.createElement('option');
    option.value = index; // Use index as the value for easy access
    option.innerText = recipe.recipeName;
    select.appendChild(option);
  });
}

function updateRecipeCard() {
  const select = document.getElementById('recipeSelect');
  const selectedIndex = select.value;

  if (selectedIndex === "") {
    return; // Exit if no recipe is selected
  }

  const selectedRecipe = recipes[selectedIndex];
  document.getElementById('recipeName').innerText = selectedRecipe.recipeName;
  document.getElementById('recipeCategory').innerText = `${selectedRecipe.category} | ${selectedRecipe.subcategory}`;

  // Populate ingredients with hyperlinks
  const ingredientsList = document.getElementById('ingredientsList');
  ingredientsList.innerHTML = ''; // Clear previous ingredients
  const ingredientsArray = selectedRecipe.ingredients.split(';');
  const linksArray = selectedRecipe.ingredientLinks.split(';');

  ingredientsArray.forEach((ingredient, index) => {
    const link = linksArray[index] ? `<a href="${linksArray[index]}" target="_blank">${ingredient}</a>` : ingredient;
    const li = document.createElement('li');
    li.innerHTML = link;
    ingredientsList.appendChild(li);
  });

  // Populate instructions
  const instructionsList = document.getElementById('instructionsList');
  instructionsList.innerHTML = ''; // Clear previous instructions
  const instructionsArray = selectedRecipe.instructions.split(';');
  instructionsArray.forEach(instruction => {
    const li = document.createElement('li');
    li.innerText = instruction;
    instructionsList.appendChild(li);
  });
}

// Fetch recipes when the page loads
fetchRecipes();
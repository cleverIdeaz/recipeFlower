async function fetchRecipes() {
  const response = await fetch('/.netlify/functions/getRecipes'); // Adjust based on your function
  const data = await response.json();
  return data;
}

function displayRecipes(recipes) {
  const recipeContainer = document.getElementById('recipeContainer');
  recipeContainer.innerHTML = ''; // Clear existing content

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';
    recipeCard.innerHTML = `
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <button class="view-recipe" data-url="${recipe.url}">View Recipe</button>
    `;
    recipeContainer.appendChild(recipeCard);
  });

  // Add event listeners for 'View Recipe' buttons
  const viewButtons = document.querySelectorAll('.view-recipe');
  viewButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const url = event.target.getAttribute('data-url');
      window.open(url, '_blank');
    });
  });
}

// Function to show a toast message
function showToast(message) {
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2000);
}

// Initialize the app
async function init() {
  const recipes = await fetchRecipes();
  displayRecipes(recipes);
}

// Call the init function when the page loads
window.onload = init;
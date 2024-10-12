// Wrap everything in an IIFE to avoid global scope pollution
(function() {
  let recipeData = {};
  let currentCategory = null;
  let currentSubcategory = null;
  let currentRecipe = null;

  const card = document.querySelector('.note-card');
  const title = card.querySelector('h1');
  const subtitle = card.querySelector('h2');
  const content = card.querySelector('.content');
  const backButton = card.querySelector('.back-button');
  const shareButton = card.querySelector('.share-button');
  const toast = document.querySelector('.toast');

  async function fetchData() {
    try {
      console.log('Fetching data...');
      const response = await fetch('http://localhost:3000/api/recipes', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response received:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data received:', data);
      recipeData = data;
      showCategories();
    } catch (error) {
      console.error('Error fetching data:', error);
      title.textContent = 'Error loading data';
      content.innerHTML = `<p>Error details: ${error.message}</p>`;
    }
  }

  function showCategories() {
    currentCategory = null;
    currentSubcategory = null;
    currentRecipe = null;
    
    title.textContent = 'Categories';
    subtitle.textContent = '';
    backButton.style.display = 'none';
    shareButton.style.display = 'none';
    
    content.innerHTML = Object.keys(recipeData)
      .map(category => `
        <button class="list-item" onclick="showSubcategories('${category}')">
          ${category}
        </button>
      `).join('');
  }

  function showSubcategories(category) {
    currentCategory = category;
    currentSubcategory = null;
    
    title.textContent = category;
    subtitle.textContent = 'Subcategories';
    backButton.style.display = 'block';
    
    content.innerHTML = Object.keys(recipeData[category])
      .map(subcategory => `
        <button class="list-item" onclick="showRecipes('${subcategory}')">
          ${subcategory}
        </button>
      `).join('');
  }

  function showRecipes(subcategory) {
    currentSubcategory = subcategory;
    
    title.textContent = subcategory;
    subtitle.textContent = currentCategory;
    
    content.innerHTML = recipeData[currentCategory][subcategory]
      .map(recipe => `
        <button class="list-item" onclick="showRecipe('${recipe.RecipeName}')">
          ${recipe.RecipeName}
        </button>
      `).join('');
  }

  function showRecipe(recipeName) {
    currentRecipe = recipeData[currentCategory][currentSubcategory]
      .find(r => r.RecipeName === recipeName);
    
    title.textContent = currentRecipe.RecipeName;
    subtitle.textContent = `${currentCategory} | ${currentSubcategory}`;
    shareButton.style.display = 'block';
    
    content.innerHTML = `
      <div class="recipe-content">
        <div class="recipe-section">
          <h3>Ingredients</h3>
          <ul>
            ${currentRecipe.Ingredients.split(';')
              .map(ingredient => `<li>${ingredient.trim()}</li>`)
              .join('')}
          </ul>
        </div>
        <div class="recipe-section">
          <h3>Instructions</h3>
          <ol>
            ${currentRecipe.Instructions.split(';')
              .map(instruction => `<li>${instruction.trim()}</li>`)
              .join('')}
          </ol>
        </div>
      </div>
    `;
  }

  function handleBackButton() {
    if (currentRecipe) {
      showRecipes(currentSubcategory);
    } else if (currentSubcategory) {
      showSubcategories(currentCategory);
    } else {
      showCategories();
    }
  }

  function handleShareButton() {
    const url = `${window.location.href.split('?')[0]}?category=${encodeURIComponent(currentCategory)}&subcategory=${encodeURIComponent(currentSubcategory)}&recipe=${encodeURIComponent(currentRecipe.RecipeName)}`;
    navigator.clipboard.writeText(url);
    
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2000);
  }

  // Expose necessary functions to the global scope
  window.showSubcategories = showSubcategories;
  window.showRecipes = showRecipes;
  window.showRecipe = showRecipe;

  // Wait for the DOM to be fully loaded before adding event listeners
  document.addEventListener('DOMContentLoaded', () => {
    backButton.addEventListener('click', handleBackButton);
    shareButton.addEventListener('click', handleShareButton);
    fetchData();
  });
})();
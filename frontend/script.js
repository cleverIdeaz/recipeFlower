// Fetch recipes from the API
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    console.log('Fetched data:', data);
    
    if (!Array.isArray(data)) {
      throw new Error('Expected an array');
    }
    
    organizeData(data);
    showCategories();
  } catch (error) {
    console.error('Error fetching data:', error);
    title.textContent = 'Error loading data';
  }
}

// Organize the fetched data
function organizeData(rows) {
  console.log('Organizing data:', rows);
  recipeData = rows.reduce((acc, row) => {
    if (!acc[row.Category]) {
      acc[row.Category] = {};
    }
    if (!acc[row.Category][row.Subcategory]) {
      acc[row.Category][row.Subcategory] = [];
    }
    acc[row.Category][row.Subcategory].push(row);
    return acc;
  }, {});
}

// Display categories
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

// Display subcategories
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

// Display recipes
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

// Display a single recipe
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
          ${currentRecipe.Ingredients.split('•')
            .filter(ingredient => ingredient.trim() !== '')
            .map(ingredient => `<li>${ingredient.trim()}</li>`)
            .join('')}
        </ul>
      </div>
      <div class="recipe-section">
        <h3>Instructions</h3>
        <ol>
          ${currentRecipe.Instructions.split('•')
            .filter(instruction => instruction.trim() !== '')
            .map(instruction => `<li>${instruction.trim()}</li>`)
            .join('')}
        </ol>
      </div>
    </div>
  `;
}

// Event listeners and initial fetch
backButton.addEventListener('click', () => {
  if (currentRecipe) {
    showRecipes(currentSubcategory);
    currentRecipe = null;
    shareButton.style.display = 'none';
  } else if (currentSubcategory) {
    showSubcategories(currentCategory);
    currentSubcategory = null;
  } else {
    showCategories();
  }
});

shareButton.addEventListener('click', () => {
  const url = `${window.location.href.split('?')[0]}?category=${encodeURIComponent(currentCategory)}&subcategory=${encodeURIComponent(currentSubcategory)}&recipe=${encodeURIComponent(currentRecipe.RecipeName)}`;
  navigator.clipboard.writeText(url);
  
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2000);
});

fetchData();
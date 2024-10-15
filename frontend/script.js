document.getElementById('fetch-recipes').addEventListener('click', getRecipes);

async function getRecipes() {
    try {
        const response = await fetch('https://recipeflower.netlify.app/.netlify/functions/getRecipes');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        displayRecipes(data); // Call a function to display the recipes
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Function to display recipes in card format
function displayRecipes(recipes) {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = ''; // Clear previous recipes

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <h2>${recipe.title}</h2>
            <p>${recipe.description}</p>
            <img src="${recipe.imageUrl}" alt="${recipe.title} image" /> <!-- Assuming your data has an image URL -->
            <ul>
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <p>Instructions: ${recipe.instructions}</p>
        `;
        recipeContainer.appendChild(recipeCard);
    });
}
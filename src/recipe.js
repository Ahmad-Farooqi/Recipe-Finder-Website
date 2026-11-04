const recipeDetails = document.querySelector("#recipe-details");

const params = new URLSearchParams(window.location.search);

const recipeId = params.get("id");

console.log("Recipe ID:", recipeId);

async function getRecipeDetails() {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`,
    );

    const data = await response.json();

    const meal = data.meals?.[0];

    if (!meal) {
      recipeDetails.textContent = "Recipe not found!";
      return;
    }

    // Get ingredients and measurements
    let ingredientsHTML = "";

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredientsHTML += `
            <li class="p-2 border-b">
                ${measure} ${ingredient}
            </li>
        `;
      }
    }

    // Display recipe information
    recipeDetails.innerHTML = `
    <div class="max-w-4xl mx-auto">

        <h1 class="text-3xl font-bold mb-5">
            ${meal.strMeal}
        </h1>

        <img
            src="${meal.strMealThumb}"
            alt="${meal.strMeal}"
            class="w-full max-h-96 object-cover rounded-2xl mb-6"
        >

        <p class="text-gray-600 mb-4">
            Category: ${meal.strCategory}
        </p>

        <p class="text-gray-600 mb-6">
            Cuisine: ${meal.strArea}
        </p>

        <h2 class="text-2xl font-bold mb-3">
            Ingredients
        </h2>

        <ul class="mb-8">
            ${ingredientsHTML}
        </ul>

        <h2 class="text-2xl font-bold mb-3">
            Cooking Instructions
        </h2>

        <p class="leading-7 whitespace-pre-line">
            ${meal.strInstructions}
        </p>

    </div>
`;
  } catch (error) {
    console.error("Error:", error);
    recipeDetails.textContent = "Unable to load recipe.";
  }
}
if (!recipeId) {
  recipeDetails.textContent = "No recipe selected!";
} else {
  getRecipeDetails();
}

const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-btn");
const recipeSection = document.querySelector("#section");
const categoryLinks = document.querySelectorAll(".category-link");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

async function searchRecipes() {
  const searchValue = searchInput.value.trim();

  if (searchValue === "") {
    alert("Please enter a recipe name!");
    return;
  }

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchValue)}`,
    );

    const data = await response.json();

    if (data.meals) {
      displayRecipes(data.meals);
    } else {
      recipeSection.innerHTML =
        "<p class='text-red-600 text-xl'>No recipes found!</p>";
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}
function displayRecipes(meals) {
  recipeSection.innerHTML = "";

  meals.forEach((meal) => {
    const recipeCard = document.createElement("div");

    recipeCard.className =
      "shadow-2xl w-72 rounded-2xl overflow-hidden flex flex-col h-[420px]";

    recipeCard.innerHTML = `
            
            <div class="relative">
                <img
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal}"
                    class="w-full h-64 object-cover"
                >

                <button
                    class="favorite-btn absolute top-3 right-3 text-2xl text-white"
                    data-id="${meal.idMeal}"
                    type="button"
                >
                    ♥
                </button>
            </div>
            <h2 class="p-2 font-bold text-gray-800 text-xl min-h-16">
                ${meal.strMeal}
            </h2>
            <p class="p-2 text-gray-600">
                ${meal.strArea || "Delicious recipe"}
            </p>
            <div class="p-3 mt-auto">
                <button
                    class="view-recipe m-2 p-2 px-4 bg-red-600
                    rounded-xl text-white hover:bg-red-700"
                    data-id="${meal.idMeal}"
                >
                    View Recipe
                </button>
            </div>
        `;

    recipeSection.appendChild(recipeCard);
    const favoriteButton = recipeCard.querySelector(".favorite-btn");

    // Check whether this recipe is already favourite
    if (favorites.some((item) => item.idMeal === meal.idMeal)) {
      favoriteButton.classList.replace("text-white", "text-red-600");
    }

    favoriteButton.addEventListener("click", () => {
      const index = favorites.findIndex((item) => item.idMeal === meal.idMeal);

      if (index === -1) {
        favorites.push(meal);
        favoriteButton.classList.replace("text-white", "text-red-600");
      } else {
        favorites.splice(index, 1);
        favoriteButton.classList.replace("text-red-600", "text-white");
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));

      console.log("Saved favourites:", favorites);
    });

    const viewButton = recipeCard.querySelector(".view-recipe");

    viewButton.addEventListener("click", () => {
      window.location.href = `./recipe.html?id=${meal.idMeal}`;
    });
  });
}
async function loadRandomRecipes() {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?f=a",
    );

    const data = await response.json();

    if (data.meals) {
      const sixRecipes = data.meals.slice(0, 6);
      displayRecipes(sixRecipes);
    }
  } catch (error) {
    console.error("Error loading recipes:", error);
  }
}

async function loadCategory(category) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`,
    );

    const data = await response.json();

    if (data.meals) {
      displayRecipes(data.meals);
    } else {
      recipeSection.innerHTML = "<p>No recipes found!</p>";
    }
  } catch (error) {
    console.error("Category error:", error);
  }
}
categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const category = link.dataset.category;

    if (category === "All") {
      loadRandomRecipes();
    } else {
      loadCategory(category);
    }
  });
});
const categoryLinksE = document.querySelectorAll(".category-link");
categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    categoryLinksE.forEach((item) => {
      item.classList.remove("active-category");
    });

    link.classList.add("active-category");

    const category = link.dataset.category;

    if (category === "All") {
      loadRandomRecipes();
    } else {
      loadCategory(category);
    }
  });
});
document
  .querySelector('[data-category="All"]')
  .classList.add("active-category");
searchButton.addEventListener("click", searchRecipes);
loadRandomRecipes();

const favoriteButton = recipeCard.querySelector(".favorite-btn");
const isFavorite = favorites.some((item) => item.idMeal === meal.idMeal);

if (isFavorite) {
  favoriteButton.classList.remove("text-white");
  favoriteButton.classList.add("text-red-600");
}

favoriteButton.addEventListener("click", () => {
  const index = favorites.findIndex((item) => item.idMeal === meal.idMeal);

  if (index === -1) {
    favorites.push(meal);
    favoriteButton.classList.remove("text-white");
    favoriteButton.classList.add("text-red-600");
  } else {
    favorites.splice(index, 1);
    favoriteButton.classList.remove("text-red-600");
    favoriteButton.classList.add("text-white");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
});

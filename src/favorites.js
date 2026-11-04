const favoritesContainer = document.querySelector("#favorites-container");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function displayFavorites() {
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No favourite recipes yet!</p>";
    return;
  }

  favorites.forEach((meal) => {
    const card = document.createElement("div");

    card.className = "w-72 rounded-2xl shadow-xl overflow-hidden";

    card.innerHTML = `
      <img src="${meal.strMealThumb}"
           alt="${meal.strMeal}"
           class="w-full h-64 object-cover">

      <h2 class="p-3 text-xl font-bold">
        ${meal.strMeal}
      </h2>

      <button
        class="remove-favorite bg-red-600 text-white p-2 m-3 rounded-lg"
        data-id="${meal.idMeal}"
        type="button">
        Remove Favourite
      </button>
    `;

    favoritesContainer.appendChild(card);

    card.querySelector(".remove-favorite").addEventListener("click", () => {
      favorites = favorites.filter((item) => item.idMeal !== meal.idMeal);

      localStorage.setItem("favorites", JSON.stringify(favorites));

      displayFavorites();
    });
  });
}

displayFavorites();

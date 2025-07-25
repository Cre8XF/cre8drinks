
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const drinksContainer = document.getElementById("drinksContainer");
  const drinkDetails = document.getElementById("drinkDetails");
  const suggestions = document.querySelectorAll(".suggestion");
  const randomBtn = document.getElementById("randomBtn");

  function showDrinks(drinks) {
    drinksContainer.innerHTML = "";
    drinkDetails.style.display = "none";
    drinks.forEach(drink => {
      const card = document.createElement("div");
      card.className = "drink-card";
      card.innerHTML = `
        <img src="${drink.strDrinkThumb}/preview" alt="${drink.strDrink}">
        <h3>${drink.strDrink}</h3>`;
      card.addEventListener("click", () => showDetails(drink.idDrink));
      drinksContainer.appendChild(card);
    });
  }

  function showDetails(id) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const drink = data.drinks[0];
      drinkDetails.style.display = "block";
      drinkDetails.innerHTML = `
        <h2>${drink.strDrink}</h2>
        <img src="${drink.strDrinkThumb}" style="max-width:300px" />
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <p><strong>Kategori:</strong> ${drink.strCategory || "Ukjent"}</p>
        <p><strong>Alkohol:</strong> ${drink.strAlcoholic}</p>
        ${buildIngredientsList(drink)}
        <p><strong>Instruksjon:</strong> ${drink.strInstructions}</p>
        ${drink.strVideo ? `<p><a href="${drink.strVideo}" target="_blank">▶ Se video på YouTube</a></p>` : ""}
      `;
      // 💥 Dette fikser scrollen
      drinkDetails.scrollIntoView({ behavior: "smooth" });
    });
}


  function buildIngredientsList(drink) {
    let html = "<p><strong>Ingredienser:</strong></p><ul>";
    for (let i = 1; i <= 15; i++) {
      const ing = drink[`strIngredient${i}`];
      const amt = drink[`strMeasure${i}`];
      if (ing) {
        html += `<li>${amt ? amt : ""} ${ing}</li>`;
      }
    }
    html += "</ul>";
    return html;
  }

  function fetchInitialDrinks() {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a")
      .then(res => res.json())
      .then(data => {
        if (data.drinks) {
          showDrinks(data.drinks.slice(0, 8));
        }
      });
  }

  function searchDrinks(query) {
    if (query === "Non_Alcoholic" || query === "Alcoholic") {
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${query}`)
        .then(res => res.json())
        .then(data => {
          showDrinks(data.drinks || []);
        });
    } else {
      fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json())
        .then(data => {
          showDrinks(data.drinks || []);
        });
    }
  }

  function fetchRandomDrink() {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
      .then(res => res.json())
      .then(data => {
        showDrinks(data.drinks);
      });
  }

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) searchDrinks(query);
  });

  suggestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const query = btn.textContent.trim();
      if (query.includes("Overrask")) {
        fetchRandomDrink();
      } else {
        searchDrinks(query);
      }
    });
  });

  fetchInitialDrinks();
});

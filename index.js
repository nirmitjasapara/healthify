"use strict";

// put your own value below!
const spoonKey = "c01b6881ff8043c4a822694f1a34a26c";
const recipeKey = "9c36614b6emshb6ce99fd4479793p121135jsn550a787842a8";
const recipeURL =
  "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/";
const subURL = "https://api.spoonacular.com/food/ingredients/substitutes";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayRecipes(responseJson) {
  // if there are previous results, remove them
  $("#results-list").empty();
  // iterate through the items array
  responseJson.results.forEach(item => {
    $("#results-list").append(
      `<button class="resultbuttons" value=${item.id}>${item.title}
      </button>`
    );
  });
  //display the results section
  $("#results").removeClass("hidden");
}
function displayRecipe(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the items array
  responseJson.extendedIngredients.forEach(item => {
    $("#ingredient-list").append(
      `<div class="checks" value="${item.id}" id="${item.id}">
        ${item.originalString}</div>`
    );
  });
  responseJson.analyzedInstructions[0].steps.forEach(item => {
    $("#recipe-list").append(
      `<div class="steps">
        ${item.step}</div>`
    );
  });
  //display the results section
  $("#results").addClass("hidden");
  $("#recipe").removeClass("hidden");
  $("#ingredients").removeClass("hidden");
}
function getRecipes(query, number = 10) {
  const params = {
    query,
    number
  };
  const queryString = formatQueryParams(params);
  const url = recipeURL + "search?" + queryString;

  fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "x-rapidapi-key": recipeKey
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayRecipes(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}
function getRecipe(query) {
  const url = recipeURL + query + "/information";

  fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "x-rapidapi-key": recipeKey
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayRecipe(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}
let TestJson = {
  results: [
    {
      id: 492564,
      title: "Falafel Burgers with Feta Cucumber Sauce",
      readyInMinutes: 50,
      servings: 6,
      image: "falafel-burgers-with-feta-tzatziki-sauce-492564.jpg",
      imageUrls: ["falafel-burgers-with-feta-tzatziki-sauce-492564.jpg"]
    },
    {
      id: 246916,
      title: "Bison Burger",
      readyInMinutes: 45,
      servings: 6,
      image: "Buffalo-Burger-246916.jpg",
      imageUrls: ["Buffalo-Burger-246916.jpg"]
    },
    {
      id: 245166,
      title: "Hawaiian Pork Burger",
      readyInMinutes: 40,
      servings: 4,
      image: "Hawaiian-Pork-Burger-245166.jpg",
      imageUrls: ["Hawaiian-Pork-Burger-245166.jpg"]
    },
    {
      id: 246009,
      title: "Blue Cheese Burgers",
      readyInMinutes: 55,
      servings: 4,
      image: "Blue-Cheese-Burgers-246009.jpg",
      imageUrls: ["Blue-Cheese-Burgers-246009.jpg"]
    },
    {
      id: 219957,
      title: "Carrot & sesame burgers",
      readyInMinutes: 50,
      servings: 6,
      image: "Carrot---sesame-burgers-219957.jpg",
      imageUrls: ["Carrot---sesame-burgers-219957.jpg"]
    },
    {
      id: 607109,
      title: "Turkey Zucchini Burger with Garlic Mayo",
      readyInMinutes: 45,
      servings: 6,
      image: "Turkey-Zucchini-Burger-with-Garlic-Mayo-607109.jpg",
      imageUrls: ["Turkey-Zucchini-Burger-with-Garlic-Mayo-607109.jpg"]
    },
    {
      id: 864633,
      title: "Banh Mi Burgers with Spicy Sriracha Mayo",
      readyInMinutes: 35,
      servings: 4,
      image: "banh-mi-burgers-with-spicy-sriracha-mayo-864633.jpg",
      imageUrls: ["banh-mi-burgers-with-spicy-sriracha-mayo-864633.jpg"]
    },
    {
      id: 219871,
      title: "Halloumi aubergine burgers with harissa relish",
      readyInMinutes: 20,
      servings: 4,
      image: "Halloumi-aubergine-burgers-with-harissa-relish-219871.jpg",
      imageUrls: ["Halloumi-aubergine-burgers-with-harissa-relish-219871.jpg"]
    },
    {
      id: 246177,
      title: "Grilled Beef and Mushroom Burger",
      readyInMinutes: 30,
      servings: 3,
      image: "Grilled-Beef-and-Mushroom-Burger-246177.jpg",
      imageUrls: ["Grilled-Beef-and-Mushroom-Burger-246177.jpg"]
    },
    {
      id: 245343,
      title: "Herbed Turkey Burger",
      readyInMinutes: 30,
      servings: 8,
      image: "Herbed-Turkey-Burger-245343.jpg",
      imageUrls: ["Herbed-Turkey-Burger-245343.jpg"]
    }
  ]
};

function watchForm() {
  $("#search-form").submit(event => {
    event.preventDefault();
    const search = $("#js-search-term").val();
    const number = $("#js-max-results").val();
    //getRecipes(search, number);
    displayRecipes(TestJson);
  });
  $("#results-list").on("click", ".resultbuttons", event => {
    getRecipe(event.currentTarget.value);
  });
  $("#ingredient-list").on("click", ".checks", event => {
    $(event.currentTarget).toggleClass("selected");
  });
  $("#ingred-form").submit(event => {
    event.preventDefault();
    let subids = [];
    console.log($(".selected").val());
    //getSubstitutes(search, number);
  });
}

$(watchForm);

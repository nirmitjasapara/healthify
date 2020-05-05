"use strict";

// put your own value below!
const spoonKey = "c01b6881ff8043c4a822694f1a34a26c";
const recipeKey = "9c36614b6emshb6ce99fd4479793p121135jsn550a787842a8";
const recipeURL =
  "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/";
const subURL = "https://api.spoonacular.com/food/ingredients/";

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
  $("#recipe-list").empty();
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
function displaySubstitute(responseJson) {
    if (responseJson.status == "failure")
    {
        console.log("could not find substitute");
        return;
    }
    // iterate through the items array
    let appendstr = `<div class="subcontainer">
    <h4>${responseJson.ingredient}</h4>`;
    responseJson.substitutes.forEach(item => {
        appendstr += `<p>${item}</p><hr>`;
    });
    appendstr += `</div>`;
    $("#substitutes-list").append(appendstr);
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
function getSubstitutes(subid) {
  const url = subURL + subid + "/substitutes?apiKey=" + spoonKey;
  console.log(url);

  fetch(url, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displaySubstitute(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("#search-form").submit(event => {
    event.preventDefault();
    const search = $("#js-search-term").val();
    const number = $("#js-max-results").val();
    getRecipes(search, number);
  });
  $("#results-list").on("click", ".resultbuttons", event => {
    getRecipe(event.currentTarget.value);
  });
  $("#ingredient-list").on("click", ".checks", event => {
    $(event.currentTarget).toggleClass("selected");
  });
  $("#ingred-form").submit(event => {
    event.preventDefault();
    $("#substitutes-list").empty();
    $("#substitutes").removeClass("hidden");
    $(".selected").each((i, ele) => {
        getSubstitutes($(ele).attr('value'));
    });
  });
}

$(watchForm);

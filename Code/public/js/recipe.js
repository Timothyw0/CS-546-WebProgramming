(function ($) {
  let recipeForm = $("#recipe-form");
  let recipeName = $("#recipeName");
  let alcohol = $("#Alcohol");
  let ingredients = $("#Ingredients");
  let recipe = $("#Recipe");
  let tasteScale = $("#tasteScale");
  let youtubeLink = $("#youtubeLink");
  let errorGroup = $(".error-group");
  let errorList = $("#errors-recipe");
  let successDiv = $("#successDiv");

  recipeForm.submit(function (event) {
    event.preventDefault();
    // Hide the error group
    errorGroup.attr("hidden", true);
    errorList.empty();
    // Check recipe name
    let recipeNameText = recipeName.val();
    if (
      typeof recipeNameText !== "string" ||
      recipeNameText.trim().length === 0
    ) {
      errorList.append(
        '<li class="error-text">You must enter a recipe name!</li>'
      );
      errorGroup.removeAttr("hidden");
      recipeName.focus();
      return;
    }
    // Check alcohol
    let alcoholText = alcohol.val();
    if (typeof alcoholText !== "string" || alcoholText.trim().length === 0) {
      errorList.append(
        '<li class="error-text">You must enter an alcohol!</li>'
      );
      errorGroup.removeAttr("hidden");
      alcohol.focus();
      return;
    }
    // Check ingredients
    let ingredientText = ingredients.val();
    if (
      typeof ingredientText !== "string" ||
      ingredientText.trim().length === 0
    ) {
      errorList.append(
        '<li class="error-text">You must enter ingredients!</li>'
      );
      errorGroup.removeAttr("hidden");
      ingredients.focus();
      return;
    }
    // Check recipe
    let recipeText = recipe.val();
    if (typeof recipeText !== "string" || recipeText.trim().length === 0) {
      errorList.append(
        '<li class="error-text">You must enter recipe instructions!</li>'
      );
      errorGroup.removeAttr("hidden");
      recipe.focus();
      return;
    }
    // Check taste scale
    let tasteScaleText = tasteScale.val();
    if (typeof parseInt(tasteScaleText) !== "number") {
      errorList.append(
        '<li class="error-text">You must enter a taste scale number!</li>'
      );
      errorGroup.removeAttr("hidden");
      tasteScale.focus();
      return;
    }
    // We don't need to check for youtube link since it's optional
    let youtubeLinkText = youtubeLink.val() || "";
    // Time to make the request
    let requestConfig = {
      method: "POST",
      url: "/recipes",
      contentType: "application/json",
      async: false,
      data: JSON.stringify({
        recipeName: recipeNameText.trim(),
        alcohol: alcoholText.trim(),
        ingredients: ingredientText.trim(),
        recipeBody: recipeText.trim(),
        tasteScale: tasteScaleText.trim(),
        youtubeLink: youtubeLinkText.trim(),
      }),
      success: function () {
        successDiv.removeAttr("hidden");
        successDiv.append(
          "<h3>Recipe successfully added! Cheers!</h3><p>Please wait to be redirected</p>"
        );
        setTimeout(() => {
          $(location).attr("href", "/feed");
        }, 2000);
      },
      error: function (response) {
        const errors = response.responseJSON.errors;
        for (let i = 0; i < errors.length; i++) {
          console.log(errors[i]);
          results.append(`<li>${errors[i]}!</li>`);
        }
        errorGroup.removeAttr("hidden");
        return;
      },
    };
    $.ajax(requestConfig).then(function (responseMessage) {});
  });
})(window.jQuery);

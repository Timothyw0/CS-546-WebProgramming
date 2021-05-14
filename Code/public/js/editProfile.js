//const emailValidator = require('email-validator');
(function ($) {
  console.log(5);
  let firstName = $("#firstNameEdit");
  let lastName = $("#lastNameEdit");
  let username = $("#usernameEdit");
  let email = $("#emailEdit");
  let dateOfBirth = $("#dateOfBirthEdit");
  let favoriteCocktail = $("#cocktailEdit");
  let editProfileForm = $("#edit-profile-form");
  let results = $("#results");
  let alertDiv = $(".alert");
  let successDiv = $(".success");
  let userID = $(".userID").html().trim();

  editProfileForm.submit(function (event) {
    event.preventDefault();
    alertDiv.attr("hidden", true);
    results.empty();
    let firstNameText = firstName.val();
    if (
      typeof firstNameText !== "string" ||
      firstNameText.trim().length === 0
    ) {
      results.append("<li>You must enter text in your firstName bar!</li>");
      alertDiv.removeAttr("hidden");
      return;
    }

    //firstName.focus();
    let lastNameText = lastName.val();
    if (typeof lastNameText !== "string" || lastNameText.trim().length === 0) {
      results.append("<li>You must enter text in your lastName bar!</li>");
      alertDiv.removeAttr("hidden");
      return;
    }
    let usernameText = username.val();
    if (typeof usernameText !== "string" || usernameText.trim().length === 0) {
      results.append("<li>You must enter text in your username bar!</li>");
      alertDiv.removeAttr("hidden");
      return;
    }
    let emailText = email.val();
    let validEmail = false;
    for (let i = 0; i < emailText.length && validEmail === false; i++) {
      if (emailText[i] === "@") {
        validEmail = true;
      }
    }
    if (
      !emailText.includes(".com") &&
      !emailText.includes(".edu") &&
      !emailText.includes(".org")
    ) {
      validEmail = false;
    }
    if (
      !validEmail ||
      typeof emailText != "string" ||
      emailText.trim().length === 0
    ) {
      results.append(
        "<li>You must enter a valid e-mail in your e-mail bar!</li>"
      );
      alertDiv.removeAttr("hidden");
      return;
    }
    let favoriteCocktailText = favoriteCocktail.val();
    console.log(favoriteCocktailText);
    if (
      typeof favoriteCocktailText !== "string" ||
      favoriteCocktailText.trim().length === 0
    ) {
      results.append("<li>You must enter a favorite cocktail!</li>");
      alertDiv.removeAttr("hidden");
      return;
    }
    let dateOfBirthText = dateOfBirth.val();
    if (!dateOfBirthText) {
      results.append(
        "<li>You must enter valid text in your birthdate bar!</li>"
      );
      alertDiv.removeAttr("hidden");
      return;
    }

    //signUpButton.click();
    let requestConfig = {
      method: "POST",
      url: `/edit/profile/${userID}`,
      contentType: "application/json",
      async: false,
      data: JSON.stringify({
        firstName: firstNameText,
        lastName: lastNameText,
        username: usernameText,
        email: emailText,
        dateOfBirth: dateOfBirthText,
        favoriteCocktail: favoriteCocktailText,
      }),
      success: function () {
        successDiv.removeAttr("hidden");
        successDiv.append(
          "<h3>Edit successful! Cheers!</h3><p>Please wait to be redirected</li>"
        );
        setTimeout(() => {
          $(location).attr("href", "/feed");
        }, 2000);
      },
      error: function (response) {
        // Parse JSON of errors and render them in alert div
        console.log(response);
        const errors = response.responseJSON.errors;
        for (let i = 0; i < errors.length; i++) {
          console.log(errors[i]);
          results.append(`<li>${errors[i]}!</li>`);
        }
        alertDiv.removeAttr("hidden");
      },
    };
    console.log(requestConfig);
    $.ajax(requestConfig);
  });
})(window.jQuery);

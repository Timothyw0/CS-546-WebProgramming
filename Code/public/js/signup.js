//const emailValidator = require('email-validator');
(function ($) {
  console.log(5);
  let firstName = $("#firstNameSignUp");
  let lastName = $("#lastNameSignUp");
  let username = $("#usernameSignUp");
  let password = $("#passwordSignUp");
  let email = $("#emailSignUp");
  let dateOfBirth = $("#dateOfBirthSignUp");
  let signUpForm = $("#signup-form");
  let results = $("#results");
  let signUpButton = $("#submitSignUp");
  let alertDiv = $(".alert");
  let successDiv = $(".success");

  signUpForm.submit(function (event) {
    event.preventDefault();
    console.log("Test BK");
    alertDiv.attr("hidden", true);
    results.empty();
    let firstNameText = firstName.val();
    if (
      typeof firstNameText !== "string" ||
      firstNameText.trim().length === 0
    ) {
      results.append("<li>You must enter text in your firstName bar!</li>");
      alertDiv.removeAttr("hidden");
    }

    //firstName.focus();
    let lastNameText = lastName.val();
    if (typeof lastNameText !== "string" || lastNameText.trim().length === 0) {
      results.append("<li>You must enter text in your lastName bar!</li>");
      alertDiv.removeAttr("hidden");
    }
    let usernameText = username.val();
    if (typeof usernameText !== "string" || usernameText.trim().length === 0) {
      results.append("<li>You must enter text in your username bar!</li>");
      alertDiv.removeAttr("hidden");
    }
    let passwordText = password.val();
    if (typeof passwordText !== "string" || passwordText.trim().length === 0) {
      results.append("<li>You must enter text in your password bar!</li>");
      alertDiv.removeAttr("hidden");
    }
    let emailText = email.val();
    let validEmail = false;
    for (let i = 0; i < emailText.length && validEmail === false; i++) {
      if (emailText[i] === "@") {
        validEmail = true;
      }
    }
    if (!emailText.includes(".com")) {
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
    }
    let dateOfBirthText = dateOfBirth.val();
    console.log(dateOfBirthText);
    let splitDate = dateOfBirthText.split("-");
    console.log(splitDate[1]);
    if (!splitDate[0] || !splitDate[1] || !splitDate[2]) {
      results.append(
        "<li>You must enter valid text in your birthdate bar!</li>"
      );
      alertDiv.removeAttr("hidden");
    }
    console.log("Kingsbery");

    //signUpButton.click();
    let requestConfig = {
      method: "POST",
      url: "/signup",
      contentType: "application/json",
      async: false,
      data: JSON.stringify({
        firstName: firstNameText,
        lastName: lastNameText,
        username: usernameText,
        password: passwordText,
        email: emailText,
        dateOfBirth: dateOfBirthText,
      }),
      success: function () {
        successDiv.removeAttr("hidden");
        successDiv.append(
          "<h3>Signup successful! Cheers!</h3><p>Please wait to be redirected</li>"
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
    $.ajax(requestConfig);
  });
})(window.jQuery);

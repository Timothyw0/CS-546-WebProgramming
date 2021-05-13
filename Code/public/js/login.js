(function ($) {
  let username = $("#username-login");
  let password = $("#password-login");
  let loginForm = $(".login-form");
  let errorGroup = $(".error-group");
  let results = $("#results-login");
  loginForm.submit(function (event) {
    event.preventDefault();
    // Hide the error group
    errorGroup.attr("hidden", true);
    results.empty();
    let usernameText = username.val();
    if (typeof usernameText !== "string" || usernameText.trim().length === 0) {
      results.append('<li class="error-text">You must enter a username!</li>');
      errorGroup.removeAttr("hidden");
      username.focus();
      return;
    }
    //firstName.focus();
    let passwordText = password.val();
    if (typeof passwordText !== "string" || passwordText.trim().length === 0) {
      results.append('<li class="error-text">You must enter a password!</li>');
      errorGroup.removeAttr("hidden");
      password.focus();
      return;
    }
    let requestConfig = {
      method: "POST",
      url: "/login",
      contentType: "application/json",
      async: false,
      data: JSON.stringify({
        username: usernameText,
        password: passwordText,
      }),
      success: function () {
        $(location).attr("href", "/feed");
      },
      error: function () {
        results.append(
          '<li class="error-text">Incorrect username/password!</li>'
        );
        username.val("");
        password.val("");
        username.focus();
        errorGroup.removeAttr("hidden");
        return;
      },
    };
    $.ajax(requestConfig).then(function (responseMessage) {});
  });
})(window.jQuery);

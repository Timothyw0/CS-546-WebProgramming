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
      results.append("<li>You must enter a login!</li>");
      errorGroup.removeAttr("hidden");
      return;
    }
    //firstName.focus();
    let passwordText = password.val();
    if (typeof passwordText !== "string" || passwordText.trim().length === 0) {
      results.append("<li>You must enter a password!</li>");
      errorGroup.removeAttr("hidden");
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
    };
    $.ajax(requestConfig).then(function (responseMessage) {});
  });
})(window.jQuery);

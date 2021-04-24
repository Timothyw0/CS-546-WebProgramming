(function ($) {
  // Let's start writing AJAX calls!

  let addPostForm = $("#addPostForm");
  let addPostText = $("#addPostText");
  let addPostRecipe = $("#addPostRecipe");
  let inputRecipe = addPostRecipe.val();
  let errorDiv = $("#errorDiv");
  let successDiv = $("#successDiv");

  // On submit event listener for adding new post
  addPostForm.submit(function (event) {
    event.preventDefault();

    // Hide the errorDiv and clear it
    errorDiv.attr("hidden", true);
    errorDiv.empty();
    // Hide the successDiv too
    successDiv.attr("hidden", true);
    successDiv.empty();

    // Error check that the text area was filled
    let inputText = addPostText.val();
    // No text was inputted, show the error div and let the user know
    if (inputText.trim().length === 0) {
      errorDiv.removeAttr("hidden");
      errorDiv.append("<p>You must enter text in your post!</p>");
      addPostText.val("");
      addPostText.focus();
      return;
    }

    // Everything looks good so we can make the request now
    var requestConfig = {
      method: "POST",
      url: "/posts/add",
      contentType: "application/json",
      async: false,
      data: JSON.stringify({
        text: inputText.trim(),
        recipe: inputRecipe,
      }),
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      successDiv.removeAttr("hidden");
      successDiv.append("<h3>Post successfully added! Cheers!</h3>");
    });
  });
})(window.jQuery);

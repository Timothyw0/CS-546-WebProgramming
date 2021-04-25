(function ($) {
  // Let's start writing AJAX calls!

  let addPostForm = $("#addPostForm");
  let addPostText = $("#addPostText");
  let addPostRecipe = $("#addPostRecipe");
  let inputRecipe = addPostRecipe.val();

  let editPostDiv = $("#editPostDiv");
  let editPostForm = $("#editPostForm");
  let editPostText = $("#editPostText");
  let editPostRecipe = $("#editPostRecipe");
  let inputEditRecipe = editPostRecipe.val();

  let deletePostForm = $("#deletePostForm");

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
    let requestConfig = {
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
      successDiv.append(
        "<h3>Post successfully added! Cheers!</h3><p>Please wait to be redirected</p>"
      );
      setTimeout(() => {
        $(location).attr("href", "/feed");
      }, 2000);
    });
  });

  // On submit event listener for editing post
  editPostForm.submit(function (event) {
    event.preventDefault();

    // Hide the errorDiv and clear it
    errorDiv.attr("hidden", true);
    errorDiv.empty();
    // Hide the successDiv too
    successDiv.attr("hidden", true);
    successDiv.empty();

    // Error check that the text area was filled
    let inputText = editPostText.val();
    // No text was inputted, show the error div and let the user know
    if (inputText.trim().length === 0) {
      errorDiv.removeAttr("hidden");
      errorDiv.append("<p>You must enter text in your post!</p>");
      editPostText.val("");
      editPostText.focus();
      return;
    }

    let postID = editPostDiv.find("#postID").html();

    // Everything looks good so we can make the request now
    let requestConfig = {
      method: "PUT",
      url: "/posts/edit",
      contentType: "application/json",
      async: false,
      data: JSON.stringify({
        text: inputText.trim(),
        recipe: inputEditRecipe,
        postID: postID,
      }),
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      successDiv.removeAttr("hidden");
      successDiv.append(
        "<h3>Post successfully editted! Cheers!</h3><p>Please wait to be redirected</p>"
      );
      setTimeout(() => {
        $(location).attr("href", "/feed");
      }, 2000);
    });
  });

  // On submit event listener for deleting post
  deletePostForm.submit(function (event) {
    event.preventDefault();

    // Hide the errorDiv and clear it
    errorDiv.attr("hidden", true);
    errorDiv.empty();
    // Hide the successDiv too
    successDiv.attr("hidden", true);
    successDiv.empty();

    // Error check that the text area was filled
    if (confirm("Are you sure you want to delete your post?")) {
      let postID = editPostDiv.find("#postID").html();

      let requestConfig = {
        method: "PUT",
        url: "/posts/delete",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
          postID: postID,
        }),
      };
      $.ajax(requestConfig).then(function (responseMessage) {
        successDiv.removeAttr("hidden");
        successDiv.append(
          "<h3>Post successfully deleted! Cheers!</h3><p>Please wait to be redirected</p>"
        );
        setTimeout(() => {
          $(location).attr("href", "/feed");
        }, 2000);
      });
    } else {
      return;
    }
  });
})(window.jQuery);

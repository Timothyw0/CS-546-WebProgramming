(function ($) {
  // Let's start writing AJAX calls!
  let postColumn = $("#postColumn");

  // User clicked like on a post, we need to send a request to posts endpoint
  function bindEventsToLikeButton(post) {
    post.find("#likePost").on("click", function (event) {
      event.preventDefault();
      let likedUsers = post.find("#likeList");
      let likeDiv = post.find("#likeDiv");
      let likeText = post.find("#likePost").html().trim();
      let postID = post.find("#postID").html();
      // Everything looks good so we can make the request now
      // TODO: userID needs to be configured
      // User liked
      if (likeText === "Like") {
        var requestConfig = {
          method: "POST",
          url: "/posts/like",
          contentType: "application/json",
          async: false,
          data: JSON.stringify({
            id: postID,
            userID: "607322eb50dc91a9bc14955b",
          }),
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          // Get new string of users liked
          let newLikes = `${responseMessage.likes} like this post`;
          // If the likedUsers section doesn't exist, we need to add it
          if ($(likedUsers).text().length === 0) {
            likeDiv.append(`<p><em>${newLikes}</em></p>`);
          } else {
            $(likedUsers).text(newLikes);
          }
          // After making request, change the text to unlike
          $(post.find("#likePost")).text("Unlike");
        });
      }
      // User clicked unlike
      else if (likeText === "Unlike") {
        var requestConfig = {
          method: "POST",
          url: "/posts/unlike",
          contentType: "application/json",
          async: false,
          data: JSON.stringify({
            id: postID,
            userID: "607322eb50dc91a9bc14955b",
          }),
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          // Get new string of users liked
          let newLikes = `${responseMessage.likes} like this post`;
          // If there are no likes, we need to clear the div
          if (!responseMessage.likes) {
            likeDiv.empty();
          } else {
            $(likedUsers).text(newLikes);
          }
          // After making request, change the text to like
          $(post.find("#likePost")).text("Like");
        });
      }
    });
  }

  // Bind the like button on every post
  postColumn.children().each(function (index, element) {
    bindEventsToLikeButton($(element));
  });

  // Bind the like button on the singlePost like button as well
  bindEventsToLikeButton($("#singlePost"));
})(window.jQuery);

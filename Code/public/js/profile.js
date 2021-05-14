(function ($, localStorage) {
  // Let's start writing AJAX calls!
  let followLink = $(".followLink");
  let userID = $(".userID").html().trim();
  let postColumn = $("#postColumn");

  // User clicked follow or unfollow, we need to send a request to users endpoint
  function bindEventsToFollowButton(link) {
    link.on("click", function (event) {
      event.preventDefault();
      let linkText = link.html().trim();
      console.log(linkText);
      // User followed
      if (linkText === "Follow") {
        let requestConfig = {
          method: "POST",
          url: `/users/follow/${userID}`,
          contentType: "application/json",
          async: false,
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          // After making request, change the text to Unfollow
          link.html("Unfollow");
          bindEventsToFollowButton(unfollow);
        });
      }
      // User unfollowed
      else if (linkText === "Unfollow") {
        let requestConfig = {
          method: "POST",
          url: `/users/unfollow/${userID}`,
          contentType: "application/json",
          async: false,
        };
        console.log(requestConfig);

        $.ajax(requestConfig).then(function (responseMessage) {
          console.log(responseMessage);
          // After making request, change the text to Unfollow
          link.html("Follow");
          bindEventsToFollowButton(follow);
        });
      }
    });
  }

  // User clicked like on a post, we need to send a request to posts endpoint
  function bindEventsToLikeButton(post) {
    post.find(".likePost").on("click", function (event) {
      event.preventDefault();
      let likedUsers = post.find(".likeList");
      let likeDiv = post.find(".likeDiv");
      let likeText = post.find(".likePost").html().trim();
      let postID = post.find(".postID").html();
      // Everything looks good so we can make the request now
      // User liked
      if (likeText === "Like") {
        let requestConfig = {
          method: "POST",
          url: "/posts/like",
          contentType: "application/json",
          async: false,
          data: JSON.stringify({
            id: postID,
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
          $(post.find(".likePost")).text("Unlike");
        });
      }
      // User clicked unlike
      else if (likeText === "Unlike") {
        let requestConfig = {
          method: "POST",
          url: "/posts/unlike",
          contentType: "application/json",
          async: false,
          data: JSON.stringify({
            id: postID,
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
          $(post.find(".likePost")).text("Like");
        });
      }
    });
  }

  // Bind to event to buttons
  bindEventsToFollowButton(followLink);

  // Bind the like button on every post
  postColumn.children().each(function (index, element) {
    bindEventsToLikeButton($(element));
  });
})(jQuery, window.localStorage);

(function ($, localStorage) {
  // Let's start writing AJAX calls!
  let postColumn = $("#postColumn");
  let postAlert = $("#newPostAlertDiv");
  let fetchMorePosts = $("#fetchMorePosts");

  // Handlebars template set up
  let postTemplate = `<div class="post">
    <a href="/users/profile/{{creator}}">
     <h1 class="postHyperlink">
        {{username}}
     </h1>
    </a>
    <!-- if canEdit block -->
    {{#if canEdit}}
    <a href="/posts/edit/{{_id}}" class="editIcon">
        <img src="/public/images/edit.png" alt="Edit this post" />
    </a>
    {{/if}}
    <!-- end if block -->
    <h2>{{ date }}</h2>
    <!-- if recipe block -->
    {{#if recipe}}
    <a href="/recipes/{{recipe._id}}">
        <p>{{ recipe.recipeName }}</p>
    </a>
    {{#if recipe.youtubeLink}}
    <iframe width="420" height="315" src="{{recipe.youtubeLink}}">
    </iframe>
    {{/if}}
    {{/if}}
    <!-- end if block -->
    <br />
    <p>{{ text }}</p>
    <!-- if likeList block -->
    <div class="likeDiv">
        {{#if likeList}}
        <p>
            <em class="likeList">{{ likeList }} like this post</em>
        </p>
        {{/if}}
    </div>
    <!-- end if block -->
    <!-- if liked block -->
    {{#if liked}}
    <a href="" class="postInteraction likePost">
        Unlike
    </a>
    {{else}}
    <a href="" class="postInteraction likePost">
        Like
    </a>
    {{/if}}
    <!-- end if block -->
    <a href="/comment/addcomment/{{_id}}" class="postInteraction">
        Comment
    </a>
    <a href="/posts/{{ _id }}" class="postInteraction">
        Expand Post
    </a>
    <!-- if block for comments -->
    {{#if comments}}
    <div class="commentDiv">
        <!-- iterate through the comments -->
        {{#each comments}}
        <div class="individualComment">
        {{#if isCommentOwner}}
         <a class="btn-del comment-delete-icon" data-id="{{_id}}">
            <img src="/public/images/trash.svg" alt="delete-comment">
          </a>
        {{/if}}
            <p class="commentUser">{{username}}</p>
            <p class="commentText">{{comment}}</p>
        </div>
        {{/each}}
    </div>
    {{/if}}

    <!-- end if block -->
    <!-- Hidden postID in order to make AJAX requests -->
    <p class="postID" hidden>{{_id}}</p>
</div>`;
  // After making the call we have to use the template
  let compiledPost = Handlebars.compile(postTemplate);

  // Add skipPosts to localStorage, this is used to fetch more posts
  localStorage["skipPosts"] = 1;

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

  // Function to bind to delete comment buttons, need to bind when user gets more posts
  function initializeDeleteClick() {
    $(".btn-del").on("click", function (event) {
      event.preventDefault();
      var button = $(this);
      var commentId = button.data("id");

      var requestConfig = {
        method: "DELETE",
        url: "/comment/" + commentId,
        contentType: "application/json",
        data: JSON.stringify({
          id: commentId,
        }),
      };
      $.ajax(requestConfig).then(function (responseMessage) {
        $(location).attr("href", "/feed");
      });
    });
  }

  // Bind the like button on every post
  postColumn.children().each(function (index, element) {
    bindEventsToLikeButton($(element));
  });

  // Bind the like button on the singlePost like button as well
  bindEventsToLikeButton($("#singlePost"));

  // Bind event to get more posts function
  fetchMorePosts.on("click", function (event) {
    event.preventDefault();
    // Make an AJAX call to get partial posts, with skipPosts in local storage
    let skipNum = localStorage["skipPosts"];
    let requestConfig = {
      method: "GET",
      url: "/posts/getMorePosts",
      async: false,
      data: {
        skipPosts: skipNum,
      },
    };
    // Make the request and add the posts
    $.ajax(requestConfig).then(function (responseMessage) {
      // If there are no more posts to show, replace the hyperlink with text
      console.log(responseMessage);
      if (responseMessage.length === 0) {
        fetchMorePosts.attr("hidden", true);
        $("#noMorePosts").removeAttr("hidden");
      }
      for (let i = 0; i < responseMessage.length; i++) {
        let newPost = compiledPost(responseMessage[i]);
        postColumn.append(newPost);
      }
    });
    // Increment skipPosts in localStorage
    localStorage["skipPosts"]++;
    // Bind links again
    postColumn.children().each(function (index, element) {
      bindEventsToLikeButton($(element));
    });
    // Bind delete comment links
    initializeDeleteClick();
  });

  // Timeout listener to check if there are any new posts, if there are, add it to the post Div using template
  // Use window function to set timeout for every 20 seconds
  let iteration = 0;
  window.setInterval(function () {
    let requestConfig = {
      method: "GET",
      url: "/posts/all",
      contentType: "application/json",
      async: false,
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      // If this is the first iteration, start the localStorage to include all post IDs that exist
      if (iteration === 0) {
        let allIDs = "";
        for (let i = 0; i < responseMessage.length; i++) {
          allIDs += responseMessage[i]._id;
          if (i !== responseMessage.length - 1) {
            allIDs += ",";
          }
        }
        localStorage["seenIDs"] = allIDs;
      }
      // If it's the 10th iteration, stop fetching to save memory
      if (iteration >= 10) {
        return;
      }
      // Go through responseMessage and append any new messages in the div, we can compare using localStorage ids we have already seen
      let seenIDArr = localStorage["seenIDs"].split(",");
      for (let i = responseMessage.length - 1; i >= 0; i--) {
        let postID = responseMessage[i]._id;
        // If we haven't seen this post before, append it to the top of the post column and then add to localStorage
        if (!seenIDArr.includes(postID)) {
          let newPost = compiledPost(responseMessage[i]);
          postColumn.prepend(newPost);
          localStorage["seenIDs"] += `,${responseMessage[i]._id}`;
          // Bind links again
          postColumn.children().each(function (index, element) {
            bindEventsToLikeButton($(element));
          });
        }
      }
    });
    iteration++;
  }, 10000);
})(jQuery, window.localStorage);

(function ($) {
  function loadData() {
    let requestConfig = {
      method: "GET",
      url: "/",
      contentType: "application/json",
    };

    $.ajax(requestConfig).then((response) => {
      const commentsContainer = $("#comments");
      let html = "";
      response.forEach((comment) => {
        html += `<li>${comment.comment}</li> <button class="btn-del" data-id="${comment._id}">Delete</button>`;
      });
      commentsContainer.html(html);
    });
  }
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
  $("#addComment").on("click", function (event) {
    event.preventDefault();
    var button = $(this);
    var comment = $("#message-text").val();
    var postId = $("#postId").val();
    var userId = $("#userId").val();
    const successDiv = $("#successDiv");

    var requestConfig = {
      method: "POST",
      url: "/comment/insertData",
      contentType: "application/json",
      data: JSON.stringify({
        comment,
        userId,
        postId,
      }),
    };
    $.ajax(requestConfig).then(function (responseMessage) {
      $("#message-text").val("");
      successDiv.removeAttr("hidden");
      successDiv.append(
        "<h3>Comment successfully added! Cheers!</h3><p>Please wait to be redirected</p>"
      );
      setTimeout(() => {
        $(location).attr("href", "/feed");
      }, 2000);
    });
  });

  initializeDeleteClick();
})(window.jQuery);

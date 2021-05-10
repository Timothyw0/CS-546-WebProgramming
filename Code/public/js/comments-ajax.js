(function ($) {

  function loadData() {
    let requestConfig = {
      method: "GET",
      url: "/",
      contentType: "application/json"
    };

    $.ajax(requestConfig).then((response) => {
      debugger;
      const commentsContainer = $('#comments');
      let html = '';
      response.forEach(comment => {
        html += `<li>${comment.comment}</li> <button class="btn-del" data-id="${comment._id}">Delete</button>`
      });
      commentsContainer.html(html);
      initializeDeleteClick();
    });
  };
  function initializeDeleteClick() {
    $('.btn-del').on('click', (function (event) {
      event.preventDefault();
      var button = $(this);
      var reviewId = button.data('id');

      var requestConfig = {
        method: "DELETE",
        url: '/' + reviewId,
        contentType: 'application/json',
        data: JSON.stringify({
          id: reviewId
        })
      }
      $.ajax(requestConfig).then(function (responseMessage) {
        loadData();
      });
    }));
  }
  $('#addComment').on('click', (function (event) {
    event.preventDefault();
    var button = $(this);
    var comment = $('#message-text').val();

    var requestConfig = {
      method: "POST",
      url: '/insertData',
      contentType: 'application/json',
      data: JSON.stringify({
        comment
      })
    }
    $.ajax(requestConfig).then(function (responseMessage) {
      $('#message-text').val('');
      loadData();
    });
  }));
  loadData();
})(window.jQuery);

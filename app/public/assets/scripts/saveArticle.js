$(document).ready(function() {
    $(document).on('click', '.save-article', function() {
        let button = $(this);
        let articleId = button.data('article-id');
        button.attr('disabled', 'disabled');

        $.ajax("/articles/saveArticle/" + articleId, {
            type: "PUT",
          }).then(
            function(data) {
              button.text('Saved');
            }
          );
    });

});
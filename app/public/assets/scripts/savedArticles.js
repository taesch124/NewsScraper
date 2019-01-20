$(document).ready(function() {
    $('.modal').modal();

    $(document).on('click', '.view-notes', function() {
        let button = $(this);
        let articleId = button.data('article-id');
        console.log('View notes for article ' + articleId);

        $.ajax({
            url: '/articles/notes/' + articleId,
            type: 'GET'
        }).then(data => {
            $('.modal-content').html(data);
            $('#article-notes-modal').modal('open');
        });
    });

});
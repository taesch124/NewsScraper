$(document).ready(function() {
    $('.modal').modal();

    $(document).on('click', '.add-note', function() {
        let button = $(this);
        let articleId = button.data('article-id');
        console.log('View notes for article ' + articleId);

        $.ajax({
            url: '/articles/addNote/' + articleId,
            type: 'GET'
        }).then(data => {
            $('.modal-content').html(data);
            $('#article-notes-modal').modal('open');
            //$('.save-note').on('click', saveNote);
        });
    });

    $(document).on('click', '.save-note', saveNote);

});

function saveNote() {
    let button = $(this);
    let articleId = button.data('article-id');
    console.log($('#note-message')[0]);
    let message = $('#note-message').val().trim();
    console.log(articleId + ": " + message);

    $.ajax({
        url: '/articles/addNote/' + articleId,
        type: 'POST',
        data: {message: message}
    }).then(data => {
        console.log('Note saved');
        $('#article-notes-modal').modal('close');
    });
}
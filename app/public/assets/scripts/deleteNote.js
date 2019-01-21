$(document).ready(function() {

    $(document).on('click', '.delete-note', function() {
        let button = $(this);
        let noteId = button.data('note-id');

        $.ajax({
            url: '/articles/removeNote/' + noteId,
            type: 'DELETE'
        }).then(data => {
            $('#article-notes-modal').modal('close');
        });
    });

});
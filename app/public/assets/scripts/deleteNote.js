$(document).ready(function() {

    $(document).on('click', '.delete-note', function() {
        let button = $(this);
        let noteId = button.data('note-id');
        console.log('Delete note ' + noteId);

        $.ajax({
            url: '/articles/removeNote/' + noteId,
            type: 'DELETE'
        }).then(data => {
            $('#article-notes-modal').modal('close');
            //$('.save-note').on('click', saveNote);
        });
    });

});
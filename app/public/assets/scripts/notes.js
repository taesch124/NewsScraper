$(document).ready(function() {
    $('.modal').modal();

    $(document).on('click', '.view-notes', viewNotes);
    $(document).on('click', '.add-note', addNote);
    $(document).on('click', '.save-note', saveNote);
    $(document).on('click', '.clear-notes', clearNotes);

});

function addNote() {
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
}

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

function clearNotes() {
    let button = $(this);
    let articleId = button.data('article-id');
    console.log(articleId);

    $.ajax({
        url: '/articles/clearNotes/' + articleId,
        type: 'PUT'
    }).then(data => {
        console.log(data);
    });
}

function viewNotes() {
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
}
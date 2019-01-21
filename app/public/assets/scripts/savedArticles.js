$(document).ready(function() {
    $('.modal').modal();

    $(document).on('click', '.clear-saved', clearSaved);
});

function clearSaved() {
    let button = $(this);
    let articleId = button.data('article-id');
    console.log('Unsaving ' + articleId);

    $.ajax({
        url: '/articles/clearSaved/' + articleId,
        type: 'PUT'
    }).then(data => {
        console.log(data);
        window.location.reload();
    });
}
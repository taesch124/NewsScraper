$(document).ready(function() {
    $('#content-container').empty();
    $('#content-container').append(loader);
    $.get('/articles/scrapeArticles')
    .then(data => {
        $('#content-container').empty();
        $('#content-container').append(data);
    });
});
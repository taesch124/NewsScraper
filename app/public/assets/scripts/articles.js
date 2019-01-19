$(document).ready(function() {
    console.log('scraping');
    $('#content-container').empty();
    $('#content-container').append(loader);
    $.get('/articles/scrapeArticles')
    .then(data => {
        $('#content-container').empty();
        $('#content-container').append(data);
    });

    $(document).on('click', '.scrape',  function() {
        console.log('scraping');
        $('#content-container').empty();
        $('#content-container').append(loader);
        $.get('/articles/scrapeArticles')
        .then(data => {
            $('#content-container').empty();
            $('#content-container').append(data);
        });
    });

    
});

const loader = `<div class="row">
<div class="col s12 center-align">
    <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
            <div class="circle-clipper left">
            <div class="circle"></div>
            </div><div class="gap-patch">
            <div class="circle"></div>
            </div><div class="circle-clipper right">
            <div class="circle"></div>
            </div>
        </div>
    </div>
</div>
</div>`;
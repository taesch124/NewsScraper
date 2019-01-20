$(document).ready(function() {
    $(document).on('click', '.scrape',  function() {
        let button = $(this);
        button.attr('disabled', 'disabled');
        console.log('scraping');
        console.log(window.location.pathname);
        if(window.location.pathname === '/articles') {
            $('#content-container').empty();
            $('#content-container').append(loader);
            $.get('/articles/scrapeArticles')
            .then(data => {
                $('#content-container').empty();
                $('#content-container').append(data);
                button.attr('disabled', false);
            });
        } else {
            window.location.href = '/articles';
        }
        
    });

    $(document).on('click', '#saved-articles', function() {
        window.location.href = '/articles/savedArticles';
    });

    $(document).on('click', '#clear-saved-articles', function() {
        $.ajax({
            url: "/articles/clearSavedArticles/", 
            type: "PUT",
          }).then(
            function(data) {
              console.log('cleared');
              window.location.reload();
            }
          );
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
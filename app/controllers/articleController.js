const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const Article = require('./../models/articles');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('articles', {});
})

router.get('/scrapeArticles', (req, res) => {
    
    axios.get('https://www.nytimes.com/section/technology')
    .then(response => {
        let hbs = {};
        const $ = cheerio.load(response.data);
        //console.log($);
        let newsStream = $('section#stream-panel ol li');
        let articleCount = newsStream.length;
        let articlesSaved = 0;

        $(newsStream).each((i, element) => {
            let title = $(element).find('h2').text();
            let summary = $(element).find('p').text();
            let author = $(element).find('span').text().replace('Image', '');
            let articleUrl = 'https://www.nytimes.com' + $(element).find('a').attr('href');
            let imageUrl = $(element).find('img').attr('src');
            let saved = false;

            let obj = {
                title: title,
                summary: summary,
                author: author,
                articleUrl: articleUrl,
                imageUrl: imageUrl,
                saved: saved
            }
            let article = new Article(obj);
            
            article.saveArticle( (small) => {
                articlesSaved++;
                if(articlesSaved === articleCount) {
                    Article.findTen({}, (results) => {
                        hbs.articles = results;
                        hbs.layout = false;
                        //console.log(hbs.ar)
                        res.render('articles', hbs);
                    });
                }
            });
        });
        
    });
    
});


module.exports = router;
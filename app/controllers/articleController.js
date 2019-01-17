const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const Articles = require('./../models/articles');

const router = express.Router();

router.get('/', (req, res) => {
    
    axios.get('https://www.nytimes.com/section/technology')
    .then(response => {
        console.log('Fetching articles');
        let hbs = {};
        let articles = [];
        const $ = cheerio.load(response.data);
        //console.log($);
        let newsStream = $('section#stream-panel ol li');
        $(newsStream).each((i, element) => {
            let title = $(element).find('h2').text();
            let summary = $(element).find('p').text();
            let author = $(element).find('span').text().replace('Image', '');
            let articleUrl = $(element).find('a').attr('href');
            let imageUrl = $(element).find('img').attr('src');

            let article = {
                title: title,
                summary: summary,
                author: author,
                articleUrl: articleUrl,
                imageUrl: imageUrl
            }
            
            Articles.saveArticle(article);
            articles.push(article);
        });
        hbs.articles = articles;
        res.render('articles', hbs);
    });
    
});


module.exports = router;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const Article = require('./../models/articles');
const Note = require('./../models/notes');

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

router.get('/savedArticles', (req, res) => {
    Article.findTen({saved: true}, (results) => {
        res.render('saved-articles', {articles: results});
    })
});

router.put('/saveArticle/:articleId', (req, res) => {
    let id = req.params.articleId;
    Article.updateOne({"_id": id},{$set: {saved: true}}, (err, saved) => {
        if(err) throw err;

        res.send(saved);
    });
});

router.put('/clearSavedArticles', (req, res) => {
    Article.updateMany({}, {$set: {saved: false}})
    .then(saved => {
        res.send(saved);
    })
    .catch(error => {
        res.send(error);
    });
});

router.get('/notes/:articleId', (req, res) => {
    let id = req.params.articleId;
    Article.findOne({"_id": id})
    .populate('notes')
    .then(data => {
        res.render('notes', {layout: false, notes: data.notes});
    })
    .catch(error => {
        res.send(error);
    });
});

router.get('/addNote/:articleId', (req, res) => {
    res.render('add-note', {layout: false, _id: req.params.articleId});
});

router.post('/addNote/:articleId', (req, res) => {
    let articleId = req.params.articleId;
    let note = new Note({message: req.body.message});
    Note.create(note).
    then(newNote => {
        Article.updateOne({"_id": articleId}, {$push: {notes: newNote}})
        .then(saved => {
            res.send(saved);
        })
        .catch(error => {
            res.send(error);
        });
    })
    .catch(error => {
        res.send(error);
    });
});

router.delete('/removeNote/:noteId', (req, res) => {
    let noteId = req.params.noteId;
    console.log(noteId);
    Note.deleteWithReferences(noteId, (results) => {
        res.send(results);
    })
});

module.exports = router;
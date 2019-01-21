const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const Async = require('async');

const Article = require('./../models/articles');
const Note = require('./../models/notes');

const router = express.Router();

//render empty page that fires the scrape function when ready
router.get('/', (req, res) => {
    res.render('articles', {});
})

//Scraping articles and returning handlebars (without layout) to populate page
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

//Save an article
router.put('/saveArticle/:articleId', (req, res) => {
    let id = req.params.articleId;
    Article.updateOne({"_id": id},{$set: {saved: true}}, (err, saved) => {
        if(err) throw err;

        res.send(saved);
    });
});

router.put('/clearSaved/:articleId', (req, res) => {
    let articleId = req.params.articleId;
    Async.waterfall([
        function(callback) {
            Article.findOne({_id: articleId})
            .then(docs => {
                callback(null, docs);
            })
            .catch(error => {
                callback(error);
            });
        },
        function(docs, callback) {
            let noteCount = docs.notes.length;
            let counter = 0;
            docs.notes.forEach(e => {
                Note.deleteOne({_id: e})
                .then(removed => {
                    counter++;
                    if (counter === noteCount) {
                        callback(null, 'notes removed');
                    }
                }).catch(error => {
                    callback(error);
                });
            });
        },
        function(result, callback) {
            Article.updateOne({_id: articleId}, {$set: {saved: false, notes: []}})
            .then(updated => {
                callback(null, updated);
            })
            .catch(error => {
                callback(error);
            });
        }
    ],
    function(err, response) {
        if(err) {
            res.send(err);
            return;
        }

        res.send(response);
    });
});

//Clear all saved articles
router.put('/clearSavedArticles', (req, res) => {
    Async.series([
        function(callback) {
            Note.deleteMany({})
            .then(update => {
                callback(null, update);
            })
            .catch(error => {
                callback(error);
            });
        },
        function(callback) {
            Article.updateMany({}, {$set: {saved: false, notes: []}})
            .then(saved => {
                callback(null, saved);
            })
            .catch(error => {
                callback(error);
            });
        }
    ],
    function(err, response) {
        if(err) {
            res.send(err);
            return;
        }

        res.send(response);
    });
    
});

//Get all notes for particular article
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

//Get the view for adding a new note
router.get('/addNote/:articleId', (req, res) => {
    res.render('add-note', {layout: false, _id: req.params.articleId});
});

//Clear all notes from particular article
router.put('/clearNotes/:articleId', (req, res) => {
    let articleId = req.params.articleId;
    Async.waterfall([
        function(callback) {
            Article.findOne({_id: articleId})
            .then(docs => {
                callback(null, docs);
            })
            .catch(error => {
                callback(error);
            });
        },
        function(docs, callback) {
            let noteCount = docs.notes.length;
            let counter = 0;
            docs.notes.forEach(e => {
                Note.deleteOne({_id: e})
                .then(removed => {
                    counter++;
                    if (counter === noteCount) {
                        callback(null, 'notes removed');
                    }
                }).catch(error => {
                    callback(error);
                });
            });
        },
        function(result, callback) {
            Article.updateOne({_id: articleId}, {$set: {notes: []}})
            .then(updated => {
                callback(null, updated);
            })
            .catch(error => {
                callback(error);
            });
        }
    ],
    function(err, response) {
        if(err) {
            res.send(err);
            return;
        }

        res.send(response);
    });
});

//Add note to a particular article
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

//Remove a single note from a particular article
router.delete('/removeNote/:noteId', (req, res) => {
    let noteId = req.params.noteId;
    Note.deleteWithReferences(noteId, (results) => {
        res.send(results);
    })
});

module.exports = router;
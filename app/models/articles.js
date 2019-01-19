const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const articleSchema = new Schema({
    title: String,
    imageUrl: String,
    author: String,
    summary: String,
    articleUrl: String,
    saved: Boolean
});

const Article = mongoose.model('Article', articleSchema);

function saveArticle(data, callback) {
    Article.find({title: data.title}, (err, results) => {
        if(err) throw err;

        if(results.length > 0) {
            if(typeof callback === 'function') callback(results);
            return;
        } 

        Article.create(data, (err, small) => {
            if(err) throw err;
            console.log('saved');
            if (typeof callback === 'function') callback(small);
        });
    });
    
}

function findTen(where, callback) {
    Article.find(where).limit(10).exec((err, results) => {
        if (err) throw err;
        if(typeof callback === 'function') callback(results);
    });
}

module.exports = {
    saveArticle: saveArticle,
    findTen: findTen
}
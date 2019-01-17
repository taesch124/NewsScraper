const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const articleSchema = new Schema({
    title: String,
    imageUrl: String,
    author: String,
    summary: String,
    articleUrl: String
});

const Article = mongoose.model('Article', articleSchema);

function saveArticle(data) {
    Article.find({title: data.title}, (err, results) => {
        if(err) throw err;

        if(results.length > 0) return;

        Article.create(data, (err, small) => {
            if(err) throw err;
        });
    });
    
}

module.exports = {
    saveArticle: saveArticle
}
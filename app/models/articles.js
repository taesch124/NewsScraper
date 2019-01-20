const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ArticleSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    imageUrl: String,
    author: String,
    summary: String,
    articleUrl: String,
    saved: Boolean,
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

ArticleSchema.methods.saveArticle = function (callback) {
    Article.find({title: this.title}, (err, results) => {
        if(err) throw err;

        if(results.length > 0) {
            if(typeof callback === 'function') callback(results);
            return;
        } 

        Article.create(this, (err, small) => {
            if(err) throw err;
            if (typeof callback === 'function') callback(small);
        });
    });
    
}

ArticleSchema.statics.findTen = function(where, callback) {
    Article.find(where).limit(10).exec((err, results) => {
        if (err) throw err;
        if(typeof callback === 'function') callback(results);
    });
}

const Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;
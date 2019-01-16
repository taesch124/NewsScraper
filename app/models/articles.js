const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Article = new Schema({
    title: String,
    author: String,
    summary: String
});
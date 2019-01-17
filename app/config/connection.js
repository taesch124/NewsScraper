const mongoose = require('mongoose');

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NewsScraper";

mongoose.connect(MONGODB_URI);

module.exports = mongoose.connection;
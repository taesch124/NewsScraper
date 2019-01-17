const mongoose = require('mongoose');
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');

const articleController = require('./app/controllers/articleController');

const app = express();
const PORT = process.env.PORT || 8080;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NewsScraper";

mongoose.connect(MONGODB_URI);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("app/public"));

app.engine("handlebars", handlebars({ 
    defaultLayout: "main",
    layoutsDir: path.join('app/views/layouts')
}));

app.get('/', (req, res) => res.redirect('/articles'));

app.use('/articles', articleController);

app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, 'app', 'views'));

app.listen(PORT, () => {
    console.log('Server listening on: http://localhost:' + PORT);
});
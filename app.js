//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

// //GET ROUTE
// app.get("/articles", );


// // post request
// app.post("/articles", );

// // delete all of the document in collection article
// app.delete("/articles", );

//CHAINED Route

//////////////////////////////REQUEST TARGETING ALL ARTICLES///////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, results) => {
            if(err) throw err;
            res.send(results);
        });
    })
    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        
        article.save(err => {
            if(err) res.send(err);
            res.send("Successfully added a new article.");
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, err => {
            if(err) res.send(err);
            res.send("succesfully deleted all articles");
        });
    });


//////////////////////////////REQUEST TARGETING SPECIFIC ARTICLES///////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, result) => {
            if(err) res.send;
            else if(result) res.send(result);
            else res.send("Not Found");
        })
    })
    .put((req, res) => {
        Article.update(
            {title: req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content}, 
            {overwrite: true}, 
            (err, result) => {
                if(err) res.send(err);
                res.send("successful");
        });
    })
    .patch((req, res) => {
        Article.update(
            {title: req.params.articleTitle}, 
            {$set: req.body}, 
            (err, result) => {
                if(err) res.send(err);
                res.send("successful");
        });
    })
    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if(err) console.log(err);
                else console.log('successfully deleted');
            })
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
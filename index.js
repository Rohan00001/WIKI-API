const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema);


////////////////////////////////Request targeting all articles////////////////////////////////////////////////
app.route("/articles")
.get((req,res) => {
    Article.find((err,foundArticle) => {
        if(!err) res.send(foundArticle);
        else res.send(err);
    })
})
.post((req,res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err)=>{
        if(err) res.send(err);
        else res.send(newArticle);
    });
})
.delete((req,res) => {
    Article.deleteMany((err)=>{
        if(err) res.send(err);
        else res.send("All articles deleted");
    })
});


////////////////////////////////////Request targeting specific articles////////////////////////////////////////////////

app.route("/articles/:articlesTitle")
.get((req, res) => {
    Article.findOne({title:req.params.articlesTitle},(err,foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }else {
            res.send("No matching article found with title: " + req.params.articlesTitle);
        }
    })
})
.put((req, res) => {
    Article.replaceOne({title:req.params.articlesTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        (err)=>{
            if(err) res.send(err);
            else res.send("Success");
        });
})
.patch((req, res) => {
    Article.updateOne({title:req.params.articlesTitle},
        {$set:req.body},
        (err, replacedItem)=> {
            console.log('replaced item: ' + replacedItem);
            res.send(err || '<Success Message>');
        });
})
.delete((req, res) => {
    Article.deleteOne({title:req.params.articlesTitle},
         (err)=>{
            if(!err) res.send("Successfully Deleted");
         })
})

app.listen(3000 || process.env.PORT,()=>{
    console.log('Server Connected');
})
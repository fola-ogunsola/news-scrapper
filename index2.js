const express = require('express'); // Adding Express
const app = express(); // Initializing Express
const db = require('./database.js')
const bodyParser = require('body-parser');
const PORT = 4000

// const userRouter = require('./routes/user')
// const rentRouter = require('./routes/rent')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('you just hit the home page\n')
})




app.get('/api/v1/news', function getAllNews(req, res){
    let type = req.query.type;
    let query = "SELECT data -> 'score' AS score , news.title , news.url, news.description, news.extracted_text FROM analysis  JOIN news ON analysis.news_id = news.id";

    if(type && type == 'positive') {
        query = "SELECT data -> 'score' AS score , news.title , news.url FROM analysis  JOIN news ON analysis.news_id = news.id WHERE (data ->> 'score')::INT >= 0";
    }

    if(type && type == 'negative') {
        query = "SELECT data -> 'score' AS score , news.title , news.url FROM analysis  JOIN news ON analysis.news_id = news.id WHERE (data ->> 'score')::INT < 0"
    }
    db.any(query)
        .then(function(data){
            return res.json({message: "Create Rent Item Successfully!", data})

        })
        .catch(function(err){
            console.log(err)
        })
})

app.get('/api/v1/news/:id', function (req, res){
    let newsId =  req.params.id;
    let sentimentQuery = "SELECT data -> 'score' AS score , news.title , news.url FROM analysis  JOIN news ON analysis.news_id = news.id WHERE news_id = $1";
    db.any(sentimentQuery, [newsId])
    .then(function(result){
        console.log(result)
       return res.json({message: "Create Rent Item Successfully!", result})
    })
    .catch(function(err){
        console.log(err)
    })
})

app.get('/api/v1/new/daily', function(req, res){
    let queryScore = "SELECT * FROM news WHERE created_at >= current_date::timestamp "
    db.any(queryScore)
    .then(function(results){
        return res.json({message: "Create Rent Item Successfully!", results})
    })
    .catch(function(err){
        console.log(err)
    })
})

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

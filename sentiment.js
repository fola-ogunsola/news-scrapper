const db = require('./database.js')
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
var Queue=require('js-queue');
function analysisData () {
    let analyzeDataQuery = 'SELECT * FROM news WHERE is_analyzed = $1'
    db.any(analyzeDataQuery, [false]).then((result) => {
        let queue= new Queue;

        if(result && result.length > 0) {
            for(i = 0; i < result.length; i++){
                queue.add(()=> generateSentimentAnalysis(result[i], queue)) 
            }
        }
        else {
            console.log('No News to Analyze-------------')
        }
    }).catch((err)=>{
    console.log(err)
    })
}


function generateSentimentAnalysis (news, queue) {
    const data = sentiment.analyze(news.extracted_text);
    saveAnalyseNews(news.id, data);
    queue.next();
}

function saveAnalyseNews (newsId, data){
    let query = 'INSERT INTO analysis (news_id, data) VALUES ($1, $2)'
    db.none(query , [newsId, data]).then(() => {
        let updateData = 'UPDATE news SET is_analyzed = true WHERE id = $1';
        db.none(updateData, [newsId]);
        console.log('Data saved successfully');
    });
}

analysisData()
//  console.log(analyzeData.length)
// const result = sentiment.analyze(analyzeData);
// console.dir(result);    
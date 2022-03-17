const rp = require('request-promise');
const puppeteer = require('puppeteer');
var Queue=require('js-queue');
const cron = require('node-cron');
const db = require('./database.js')

//const url = 'https://newsapi.org/v2/top-headlines?country=ng&apiKey=7ec0c413585741f1ae6f4154a239fc61';

function scrapAfricanNews() {
  console.log('scrapAfricanNews Initiated +++ ')
  const options = {
      url: 'https://newsapi.org/v2/top-headlines?country=ng&apiKey=7ec0c413585741f1ae6f4154a239fc61',
      json: true,
      body: {}
  };

  let queue= new Queue;

  rp(options)
    .then(function(body){
      let element = body.articles;
      console.log('scrapAfricanNews Fetched news from NewsAPI +++ ')
      for(let i=0; i < element.length; i++) {
        queue.add(() => scrapeData(element[i], queue))
      }
    })
    .catch(function(err){
      console.log(err)
    });
}


function scrapeData(site, queue) {
  (async () => {
    console.log('scrapAfricanNews Processing news : ', site.url)
    // const browser = await puppeteer.connect({
    //   browserWSEndpoint: `ws://localhost:3000/`,
    // });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      await page.goto(site.url, {waitUntil: 'load', timeout: 90000});
      console.log('scrapAfricanNews Loaded Site content : ', site.url)
      const extractedText = await page.$eval('*', (el) => el.innerText);
      console.log('scrapAfricanNews Extracted Site content : ', site.url)
      site.extractedText = extractedText;
      saveDataToDB(site)
    } catch (e) {
      console.log('Error Fetching Result ::: ', e);
    }
    queue.next();
    await browser.close();
  })();
}


function saveDataToDB(site) {
  let selectQuery = 'SELECT * FROM news WHERE url = $1';
  db.oneOrNone(selectQuery, [site.url]).then((result) =>{
    if(result) {
      console.log('Site already exist in Database :: ', site.url)
    }
    else {
      let query = 'insert into news (source, author, title, description, url, url_to_image, published_at, content, extracted_text) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      db.none(query, [site.source.name, site.author, site.title, site.description, site.url, site.urlToImage, site.publishedAt, site.content, site.extractedText]).then(() => {
        console.log('############# Site successfully saved into record ', site.url);
      }).catch((err) => {
        console.log('Errored ', err);
      })
    }
  }).catch(() => {
    console.log('Errored ', site.url);
  })
}

scrapAfricanNews()
// cron.schedule('0 1 * * *', function (){
//      scrapAfricanNews()
//      console.log('running a task every one hour')
// })


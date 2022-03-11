// const express = require('express'); // Adding Express
// const app = express(); // Initializing Express
const puppeteer = require('puppeteer'); // Adding Puppeteer

// puppeteer.launch().then(async function(browser) {
//     const page = await browser.newPage();
//     await page.goto('https://newsapi.org/v2/top-headlines?country=ng&apiKey=7ec0c413585741f1ae6f4154a239fc61');


//     await page.screenshot({path: 'digimon-website.png'});

//     // Closing the Puppeteer controlled headless browser
//     await browser.close();
// });
// // Making Express listen on port 7000
// app.listen(7000, function() {
//   console.log('Running on port 7000.');
// });


const request = require('request');
  
const options = {
    url: 'https://newsapi.org/v2/top-headlines?country=ng&apiKey=7ec0c413585741f1ae6f4154a239fc61',
    json: true,
    body: {}
};
   
// request.get(options, (err, res, body) => {
//     if (err) {
//         return console.log(err);
//     }
//     console.log(`Status: ${res.statusCode}`);
//     console.log(body);
// });

puppeteer
  .launch()
  .then(function(browser) {
    return browser.newPage();
  })
  .then(function(page) {
    return page.goto(url).then(function() {
      return page.content();
      console.log(page)
    });
  })
  .then(function(data) {
    // $('h2', html).each(function() {
    //   console.log($(this).text());
    console.log(data)
    // });
  })
  .catch(function(err) {
    //handle error
  });

// const scrape = require('website-scraper')
// const options = {
//   urls: ['https://newsapi.org/v2/top-headlines?country=ng&apiKey=7ec0c413585741f1ae6f4154a239fc61'],
//   directory: '/path/to/save/'
// };

// // with async/await
// const result = scrape(options);

// // with promise
// scrape(options).then((result) => {});







const PORT = 9001;
const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const { response } = require('express');
const app = express();

app.use(cors());

// const url = "https://vanguardngr.com";


// // app.get('/', function (req, res) {
// //     res.json('Scraping for African news')
// // })

// // app.get('/results', (req, res) => {
//     axios(url)
//     .then(response => {
//         const data =response.data
//         const check = cheerio.load(data)
//         const news = []
//         check('.site', data).each(function() {
//             const result = check(this)
//             const title = result.find('.entry-title').text()
//             const url = result.find('a').attr('href')
//             const time = result.find('time').attr('datetime')
//             const content = result.find('p').text()

//             news.push({
//                 title,
//                 url,
//                 time,
//                 content
//             })
//             // console.log(news);
//             // console.log('here');
//         })
//         // console.log('here1');
//     }) .catch(err => console.log(err))
// // })


// app.listen(PORT, () => console.log(`server is running on port ${PORT}`));




const url = "https://guardian.ng/";


// app.get('/', function (req, res) {
//     res.json('Scraping for African news')
// })

// app.get('/results', (req, res) => {
    axios(url)
    .then(response => {
        const data =response.data
        const check = cheerio.load(data)
        const news = []
        check('.title', data).each(function() {
            const result = check(this)
            const title = result.text()
            const url = result.find('a').attr('href')
            // const time = result.find('time').attr('datetime')
            // const content = result.find('p').text()

            news.push({
                title,
                url,
                // time,
                // content
            })
            console.log(news);
            // console.log('here');
        })
        // console.log('here1');
    }) .catch(err => console.log(err))
// })


app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
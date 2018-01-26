var sentiment = require('sentiment');
var express = require('express');
var Twitter = require('twitter');
var router = express.Router();
const language = require('@google-cloud/language');
var client = new Twitter({
  consumer_key: 'gK2YDEWAxjRWgCATqj9dbUCOK',
  consumer_secret: 'L6cfzO32msfAEjQe7gJF5inieLH2O95twoWYpwy2s6NKCOwsY3',
  access_token_key: '945822571982917632-NV2nlQcAzg8eViItlsaPdnliXoUmoow',
  access_token_secret: 'beV5qIzCYewBsWTMkaTAGEqS7gXcu5WvgjsX3rFwPBrEX'
});
// Imports the Google Cloud client library
//set GOOGLE_APPLICATION_CREDENTIALS=C:/Users/Josh/Downloads/TheTwitterProject-eb165a0fdc4b.json

// Creates a client
const google = new language.LanguageServiceClient();

//Global Variables
var datesToDisplay =[];
var dates = getArrayOfLastWeekDates();
var UserQuery1 = "";
var UserQuery2 ="";
var Query1Tweets = [
  [],
  [],
  [],
  [],
  [],
  [],
  []
];
var Query2Tweets = [
  [],
  [],
  [],
  [],
  [],
  [],
  []
];

router.get('/', function (req, res, next) {
  res.status(200).render('index', {
    title: 'The Twitter Project'
  });
});

router.post('/search', function (req, res, next) {
  UserQuery1 = req.body.search1;
  UserQuery2 = req.body.search2;
  var queries = [];
  queries.push(UserQuery1);
  queries.push(UserQuery2);

  GetTweetsAndComputeSentiment(queries, dates).then((results) => {
    res.render('result', {
      first: UserQuery1,
      second: UserQuery2,
      dates: datesToDisplay,
      results1: results[0],
      results2: results[1],
      gresults1: results[2],
      gresults2: results[3]
    });
  });
 });

async function GetTweetsAndComputeSentiment(queries, dates) {
  var sentiment1 = [];
  var sentiment2 = [];
  var googleSentimentarray1 = [.3,.5,0,-.2,.1,.2,.3];
  var googleSentimentarray2 = [-.3,-.5,0,.2,-.1,-.2,-.3];
  for(var j = 0; j < 2; j++){
    for (var i = 0; i < dates.length; i++) {
      var tweets = await getTweets(queries[j], dates[i], 15, "mixed");
      var sentiment = await getSentiment(tweets);
      // var googleTweets = await getTweets(queries[j], dates[i], 3, "popular");
      // var googleSentiment = 0;
      // for(var z= 0; z < googleTweets.length; z++){
      //   googleSentiment = googleSentiment + (await getOneGoogleSentiment(googleTweets[z]));
      //   console.log("Google sentiment: ", googleSentiment);
      // }
      
      if(j === 0){
        sentiment1.push(sentiment);
        //googleSentimentarray1.push(googleSentiment);
      }
      else{
        sentiment2.push(sentiment);
        //googleSentimentarray2.push(googleSentiment);
      }
    }
  }
  return [sentiment1, sentiment2, googleSentimentarray1, googleSentimentarray2];
}

function getSentiment(tweets) {
  return new Promise(resolve => {
    var sum = 0;
    for (var i = 0; i < tweets.length; i++) {
      sum = sum + sentiment(tweets[i]).comparative;
    }
    resolve(sum / tweets.length);
  });
}

function getOneGoogleSentiment(tweet){
  return new Promise(resolve =>{
    var sentiment = 0;
    var document = {
      content: tweet,
      type: 'PLAIN_TEXT',
    };
    google.analyzeSentiment({document: document}).then(results => {
      sentiment = results[0].documentSentiment.score;
      resolve(sentiment);
    }).catch(err=>{
      console.log(err);
    });
  })
}
function getTweets(query, day, count, result_type) {
  return new Promise(resolve => {
    //console.log(query);
    var listoftweets = [];
    client.get('search/tweets', {
      q: query,
      tweet_mode: "extended",
      count: count,
      result_type: result_type,
      until: day,
      exclude: "retweets",
      lang: "en"
    }, function (error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.statuses.length; i++) {
          listoftweets.push(tweets.statuses[i].full_text); //text
        }
        //console.log(tweets.statuses.length);
        resolve(listoftweets);
      } else {
        console.log("error getting tweets");
      }
    });
  });
}

function getArrayOfLastWeekDates() {
  var arrayOfTheWeek = [];
  for (var i = 0; i < 7; i++) {
    var xdate = new Date();
    var ydate = new Date();
    var x = new Date(xdate.setDate(xdate.getDate() - i+1));
    var y = new Date(ydate.setDate(ydate.getDate() - i));
    arrayOfTheWeek.push(x.toISOString().split('T')[0]);
    datesToDisplay.push(y.toISOString().split('T')[0]);
  }
  console.log("Days of the week",arrayOfTheWeek);
  return arrayOfTheWeek;
}

module.exports = router;

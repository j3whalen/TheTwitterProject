var sentiment = require('sentiment');
var express = require('express');
var Twitter = require('twitter');
var router = express.Router();
var client = new Twitter({
  consumer_key: 'gK2YDEWAxjRWgCATqj9dbUCOK',
  consumer_secret: 'L6cfzO32msfAEjQe7gJF5inieLH2O95twoWYpwy2s6NKCOwsY3',
  access_token_key: '945822571982917632-NV2nlQcAzg8eViItlsaPdnliXoUmoow',
  access_token_secret: 'beV5qIzCYewBsWTMkaTAGEqS7gXcu5WvgjsX3rFwPBrEX'
});

//Global Variables
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
      dates: dates,
      results1: results[0],
      results2: results[1]
    });
  });
 });

async function GetTweetsAndComputeSentiment(queries, dates) {
  var sentiment1 = [];
  var sentiment2 = []
  for(var j = 0; j < 2; j++){
    for (var i = 0; i < dates.length; i++) {
      var tweets = await get100Tweets(queries[j], dates[i]);
      var sentiment = await getSentiment(tweets);
      if(j === 0){
        sentiment1.push(sentiment);
      }
      else{
        sentiment2.push(sentiment);
      }
    }
  }
  return [sentiment1, sentiment2];
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

function get100Tweets(query, day) {
  return new Promise(resolve => {
    console.log(query);
    var listoftweets = [];
    client.get('search/tweets', {
      q: query,
      tweet_mode: "extended",
      count: 100,
      until: day,
      exclude: "retweets",
      lang: "en"
    }, function (error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.statuses.length; i++) {
          listoftweets.push(tweets.statuses[i].full_text); //text
        }
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
    var date = new Date();
    var x = new Date(date.setDate(date.getDate() - i));
    arrayOfTheWeek.push(x.toISOString().split('T')[0]);
  }
  console.log("Days of the week",arrayOfTheWeek);
  return arrayOfTheWeek;
}

module.exports = router;

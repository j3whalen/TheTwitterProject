var express = require('express');
var Twitter = require('twitter');
var router = express.Router();
var client = new Twitter({
  consumer_key: 'gK2YDEWAxjRWgCATqj9dbUCOK',
  consumer_secret: 'L6cfzO32msfAEjQe7gJF5inieLH2O95twoWYpwy2s6NKCOwsY3',
  access_token_key: '945822571982917632-NV2nlQcAzg8eViItlsaPdnliXoUmoow',
  access_token_secret: 'beV5qIzCYewBsWTMkaTAGEqS7gXcu5WvgjsX3rFwPBrEX'
});
/*_______________NOTES______________

+++++Google API will not be able to work++++++
for each query we are going to have 1,400 requests sent to google api, and 
after 5,000 requests we will have to start paying.

GOOD NEWS
IBM has a tone analyzer which actually might be better
it has 7 tones example (Sad,Anger,Sympathy) along with an asscociated rating(0.76)
We can really grab the emotions from these tweets we just need to find a way
to store the data and display it in a effective way.

If we use IBM API do we really need to be doing two separate queries against each other?
Like how will we display all the different parts of information. Especially from two separate queries
*/ 

//-----------------------------------------------------------------------
//Global Variables

var dates = getArrayOfLastWeekDates();
//tweets that we will be getting back will be BEFORE the date passed as a parameter
//var total = 250; //amount of tweeets we want per day Dont use yet
router.get('/', function (req, res, next) {
  res.status(200).render('index', {
    title: 'The Twitter Project'
  });
});

router.post('/search', function (req, res, next) {
  var UserQuery1 = req.body.search;
  var UserQuery2 = req.body.search2;
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


  //tweets from first search field
  // console.log("_______________________________________________________________________________________");
  // console.log("_____OUR DATES_____");
  // console.log("date[0] ", dates[0]);
  // console.log("date[1] ", dates[1]);
  // console.log("date[2] ", dates[2]);
  // console.log("date[3] ", dates[3]);
  // console.log("date[4] ", dates[4]);
  // console.log("date[5] ", dates[5]);
  // console.log("date[6] ", dates[6]);
  // console.log("___________________");
  // console.log("");
  // console.log("");
  // console.log("");

// get100Tweets(UserQuery1, dates[0], function(results){// TEST FUNCTION TO CALL GETTWEETS ONCE
//   console.log("completed get100tweets");
// });

  dates.forEach(function (date, index) {
    get100Tweets(UserQuery1, date, function (results) {
      Query1Tweets[index] = Query1Tweets[index].concat(results);
      console.log("day ", index, " Date ",results[0]);
      console.log(Query1Tweets[index]);
    });
  });

  res.render('result', {});
  // get100Tweets(UserQuery1, total, day, Query1Tweets, function (result) {
  //   res.status(200).render('result', {
  //     tweets: result
  //   });
  // });

});


function get100Tweets(query, day, callback) {
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
        //listoftweets.push(tweets.statuses[i].created_at); //Testing to see if the dates are correct
      }

      callback(listoftweets);
    } else {
      //res.status(500).json({ error: error });
      console.log("error getting tweets");
    }
  });

}

function getArrayOfLastWeekDates() {
  var arrayOfTheWeek = [];
  for (var i = 0; i < 7; i++) {
    var date = new Date();
    var x = new Date(date.setDate(date.getDate() - i));
    arrayOfTheWeek.push(x.toISOString().split('T')[0]);
  }
  return arrayOfTheWeek;
}

module.exports = router;
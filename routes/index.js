var sentiment = require('sentiment');
var express = require('express');
var Twitter = require('twitter');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var router = express.Router();
const language = require('@google-cloud/language');
var client = new Twitter({
  consumer_key: 'gK2YDEWAxjRWgCATqj9dbUCOK',
  consumer_secret: 'L6cfzO32msfAEjQe7gJF5inieLH2O95twoWYpwy2s6NKCOwsY3',
  access_token_key: '945822571982917632-NV2nlQcAzg8eViItlsaPdnliXoUmoow',
  access_token_secret: 'beV5qIzCYewBsWTMkaTAGEqS7gXcu5WvgjsX3rFwPBrEX'
});

var tone_analyzer = new ToneAnalyzerV3({
  username: '26d3b9e9-a484-4395-b498-343872f3e704',
  password: 'JEKwPJ0j3jIB',
  version: 'v3',
  version_date: '2018-01-30'
});
// Imports the Google Cloud client library
//set GOOGLE_APPLICATION_CREDENTIALS=C:/Users/Josh/Downloads/TheTwitterProject-eb165a0fdc4b.json

// Creates a client
const google = new language.LanguageServiceClient();

//Global Variables
var datesToDisplay = [];
var dates = getArrayOfLastWeekDates();
var UserQuery1 = "";
var UserQuery2 = "";
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



var emotion = {
  Anger: 0,
  Fear: 0,
  Joy: 0,
  Sadness: 0,
  Analytical: 0,
  Confident: 0,
  Tentative: 0,
  AngerScore: 0,
  FearScore: 0,
  JoyScore: 0,
  SadnessScore: 0,
  AnalyticalScore: 0,
  ConfidentScore: 0,
  TentativeScore: 0,
  overallcount: 0 // to divide by
};
var emotion2 = {
  Anger: 0,
  Fear: 0,
  Joy: 0,
  Sadness: 0,
  Analytical: 0,
  Confident: 0,
  Tentative: 0,
  AngerScore: 0,
  FearScore: 0,
  JoyScore: 0,
  SadnessScore: 0,
  AnalyticalScore: 0,
  ConfidentScore: 0,
  TentativeScore: 0,
  overallcount: 0
};


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
      gresults2: results[3],
      iresults1: results[4],
      iresults2: results[5]
    });

  });
});

async function GetTweetsAndComputeSentiment(queries, dates) {
  // var sentiment1 = [.5,.5,.5,.5,.5,.5,.5];
  // var sentiment2 = [.5,.5,.5,.5,.5,.5,.5];
  // var finalAllEmotional = [.5,.5,.5,.5,.5,.5,.5];
  // var finalAllEmotional2 = [.5,.5,.5,.5,.5,.5,.5];
  // var googleSentimentarray1 = [.5,.5,.5,.5,.5,.5,.5];
  // var googleSentimentarray2 = [.5,.5,.5,.5,.5,.5,.5];
  var sentiment1 = [];
  var sentiment2 = [];
  var finalAllEmotional = [];
  var finalAllEmotional2 = [];
  var googleSentimentarray1 = [];
  var googleSentimentarray2 = [];

  var ibmScore1 = [];
  var ibmScore2 = [];
  var ibmScore = 0;
  var ibmName = 0;
  var ibmCurrentScore = 0;
  var ibmCurrentName = 0;

  for (var j = 0; j < 2; j++) {
    var IBMtweets = await getTweets(queries[j], "", 100, "mixed", "ibm");
    for (var x = 0; x < IBMtweets.length; x++) {
      if (j === 0) {
        IBMresults = ibmScore + (await CalculateIBM(emotion, IBMtweets[x])); //get one ibm score/name is where we need to cycle through all the sentences and grab the score and names.
        console.log("Before call");
        // ibmName = ibmName + (await getOneIbmName(emotion, ibmTweets[x]));
      } else {
        IBMresults = ibmScore + (await CalculateIBM(emotion2, IBMtweets[x]));//ibmresults is array [score, name]
      }
    }
    for (var i = 0; i < dates.length; i++) {
      var tweets = await getTweets(queries[j], dates[i], 100, "mixed", "sentiment");
      var sentiment = await getSentiment(tweets);
      //var ibmTweets = await getTweets(queries[j], dates[i], 100, "mixed");



      // Can put these all one one line.
      var googleTweets = await getTweets(queries[j], dates[i], 15, "popular", "google");
      var googleSentiment = 0;
      //for(var z= 0; z < googleTweets.length; z++){
        googleSentiment = await getGoogleSentiment(googleTweets);
        console.log("Google sentiment: ", googleSentiment);
      //}

      if (j === 0) {
        sentiment1.push(sentiment);
        ibmScore1.push(ibmScore[0]);//we dont even use this?
        googleSentimentarray1.push(googleSentiment);

      } else {
        sentiment2.push(sentiment);
        ibmScore2.push(ibmScore[0]);//we dont even use this?
        googleSentimentarray2.push(googleSentiment);

      }
    }
    if (j == 0) {
      checkIfZero(finalAllEmotional, emotion.overallcount, emotion.Anger);
      checkIfZero(finalAllEmotional, emotion.overallcount, emotion.Fear);
      checkIfZero(finalAllEmotional, emotion.overallcount, emotion.Joy);
      checkIfZero(finalAllEmotional, emotion.overallcount, emotion.Sadness);
      checkIfZero(finalAllEmotional, emotion.overallcount, emotion.Analytical);
      checkIfZero(finalAllEmotional, emotion.overallcount, emotion.Confident);
      checkIfZero(finalAllEmotional, emotion.overallcount, emotion.Tentative);
    } else {
      checkIfZero(finalAllEmotional2, emotion2.overallcount, emotion2.Anger);
      checkIfZero(finalAllEmotional2, emotion2.overallcount, emotion2.Fear);
      checkIfZero(finalAllEmotional2, emotion2.overallcount, emotion2.Joy);
      checkIfZero(finalAllEmotional2, emotion2.overallcount, emotion2.Sadness);
      checkIfZero(finalAllEmotional2, emotion2.overallcount, emotion2.Analytical);
      checkIfZero(finalAllEmotional2, emotion2.overallcount, emotion2.Confident);
      checkIfZero(finalAllEmotional2, emotion2.overallcount, emotion2.Tentative);
    }

  }

  return [sentiment1, sentiment2, googleSentimentarray1, googleSentimentarray2, finalAllEmotional, finalAllEmotional2];
}

function checkIfZero(array, overallcount, namecount) {
  if (namecount === 0) {
    array.push(0);
  } else {
    array.push(namecount / overallcount);
  }
}

// ~~~~~IBM SCORE~~~~~~~
//this is where the magic happens
function CalculateIBM(array, tweets) {
  return new Promise(resolve => {
    tone_analyzer.tone({
        tone_input: tweets,
        content_type: 'text/plain'
      },
      function (err, tone) {
        if (err) {
          console.log(err);
        }
        console.log("Calculating in IBM");
        if (tone.sentences_tone[0] != null) {
          for (var i = 0; i < tone.sentences_tone.length; i++) {
            if(tone.sentences_tone[i].tones.length != 0){
                //ibmCurrentScore = tone.sentences_tone[i].tones[0].score;
                ibmCurrentName = tone.sentences_tone[i].tones[0].tone_name;
    
                if (tone.sentences_tone[i].tones[0].tone_name === "Anger") {
                  //array.AngerScore = array.AngerScore + ibmCurrentScore;
                  array.Anger++;
                  array.overallcount++;
                }
                else if (tone.sentences_tone[i].tones[0].tone_name === "Fear") {
                  //array.FearScore = array.FearScore + ibmCurrentScore;
                  array.Fear++;
                  array.overallcount++;
                }
                else if (tone.sentences_tone[i].tones[0].tone_name === "Joy") {
                  //array.JoyScore = array.JoyScore + ibmCurrentScore;
                  array.Joy++;
                  array.overallcount++;
                }
                else if (tone.sentences_tone[i].tones[0].tone_name === "Sadness") {
                  //array.SadnessScore = array.SadnessScore + ibmCurrentScore;
                  array.Sadness++;
                  array.overallcount++;
                }
                else if (tone.sentences_tone[i].tones[0].tone_name === "Analytical") {
                  //array.AnalyticalScore = array.AnalyticalScore + ibmCurrentScore;
                  array.Analytical++;
                  array.overallcount++;
                }
                else if (tone.sentences_tone[i].tones[0].tone_name === "Confident") {
                  //array.ConfidentScore = array.ConfidentScore + ibmCurrentScore;
                  array.Confident++;
                  array.overallcount++;
                }
                else if (tone.sentences_tone[i].tones[0].tone_name === "Tentative") {
                  //array.TentativeScore = array.TentativeScore + ibmCurrentScore;
                  array.Tentative++;
                  array.overallcount++;
                }
            }
            
          }
          resolve(ibmCurrentName);
        } else {
          resolve(0);
        }
      }
    );
  });
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

function getGoogleSentiment(tweet) {
  return new Promise(resolve => {
    var sentiment = 0;
    var document = {
      content: tweet,
      type: 'PLAIN_TEXT',
    };
    google.analyzeSentiment({
      document: document
    }).then(results => {
      var count = 0;
      var sum = 0;
      var sentences = results[0].sentences;
      sentences.forEach(sentence => {
          //if(sentence.sentiment.score !== 0){
            sum = sum + sentence.sentiment.score;
            count++;
            console.log("Text: ", sentence.text);
            console.log("Score: ", sentence.sentiment.score);
            console.log("mag: ",sentence.sentiment.magnitude);
          //}
      });
      console.log("count: ", count);
      sentiment = results[0].documentSentiment.score;
      //resolve(results[0].documentSentiment.score);
      resolve(sum/count);
    }).catch(err => {
      console.log(err);
    });
  })
}

function getTweets(query, day, count, result_type, api) {
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
        listoftweets = ConsolodateTweets(listoftweets, api);
        resolve(listoftweets);
      } else {
        console.log("error getting tweets");
      }
    });
  });
}

function ConsolodateTweets(listoftweets, api) {
  var array = [];
  if(api==="ibm"){
    console.log("Got IBM API");
    if (listoftweets.length <= 50) {
      return array.push(listoftweets.join('.'));
    } else {
      var first = listoftweets.slice(0, 50);
      first = first.join('.');
      var second = listoftweets.slice(50, listoftweets.length);
      second = second.join('.');
      array.push(first, second);
      return array;
    }
  }
  if(api === "google"){
    console.log("got Google API: ", listoftweets.length);
    var newtweets = listoftweets.join();
    array.push(newtweets);
    return array;
  }
  if(api === "sentiment"){
    console.log("got sentiment API");
    return listoftweets;
  }

}

function getArrayOfLastWeekDates() {
  var arrayOfTheWeek = [];
  for (var i = 0; i < 7; i++) {
    var xdate = new Date();
    var ydate = new Date();
    var x = new Date(xdate.setDate(xdate.getDate() - i + 1));
    var y = new Date(ydate.setDate(ydate.getDate() - i));
    arrayOfTheWeek.push(x.toISOString().split('T')[0]);
    datesToDisplay.push(y.toISOString().split('T')[0]);
  }
  return arrayOfTheWeek;
}

module.exports = router;
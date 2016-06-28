'use strict';
var Twitter = require('twitter');
var fs = require('fs');

var outFile = 'data/tweets.jsonl';

// . dump/secret-env.sh before launching the script
//tokens shall no be commited on github. duh.....

if(! process.env.CONSUMER_KEY){
    console.error ('you should set variable such as CONSUMER_KEY (source dump/secret-env.sh), where the variable are for the tweeter API')
}

var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

client.stream('statuses/filter', {locations:'-180,-90,180,80'}, function (stream) {
//    client.stream('statuses/filter', {track: 'science'}, function (stream) {
    stream.on('data', function (tweet) {
        if(!tweet.text){
            return;
        }
        tweet['@timestamp'] = new Date(parseInt(tweet.timestamp_ms));
        fs.appendFile(outFile, JSON.stringify(tweet)+"\n");
        console.log(tweet.text);
    });

    stream.on('error', function (error) {
        console.log(error);
    });
});

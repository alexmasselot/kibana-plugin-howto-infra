#!/usr/bin/env bash

esHost='192.168.99.100'
index='tweets'
type='example_1'
inFileTweets=/data/tweets.jsonl

until $(curl --output /dev/null --silent --head --fail "http://$esHost:9200"); do
    if [ "$waitLoop" = "" ]; then
        echo -n 'waiting for elasticSearch server to come up '
        waitLoop=1
    fi
    echo -n 'x'
    sleep 1
done
if [ $waitLoop = '' ]
then
  echo "$esHost:9200 is already up"
fi

n=$(curl -s "http://$esHost:9200/$index/$type/_count" | jq '.count')

if [ "$n" = "0"  ] || [ "$n" = ""  ] || [ "$n" = "null" ]
then
    echo ""

    echo "no $index/$type documents on $esHost => loading $inFileTweets ($(wc -l $inFileTweets))"
    i=0
    IFS=$'\n'
    for line in $(<$inFileTweets)
    do
        i=$(($i +1))
        echo -n '.'
        echo $line | curl -o /dev/null -s -XPUT "http://$esHost:9200/$index/$type/$i" --data-binary @-
    done
    echo ""
    echo "loaded $i documents"
else
    echo "already $n documents on $index/$type. skipping loading"
fi
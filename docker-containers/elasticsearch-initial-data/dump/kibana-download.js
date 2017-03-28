var elasticsearch = require('elasticsearch');
var readline = require('readline');
var fs = require('fs');
var elasticdump = require('elasticdump');
var _ = require('lodash');

var esHost = '192.168.99.102';
var fileOut = 'data/kibana.jsonl';


var client = new elasticsearch.Client({
    host: esHost + ':9200',
    log: 'info'
});


var searchAppend = function (q) {
        client.search(_.assign(
            {
                index: '.kibana'
            },
            q))
            .then(function (response) {
                var hitsCount = response.hits.total;
                if (hitsCount === 0) {
                    console.log('no data could be found.', q);
                    return;
                }

                _.each(response.hits.hits, function (hit) {
                    fs.appendFile(fileOut, JSON.stringify(hit) + "\n");
                })
            })
            .catch(function (error) {
                console.error('Error when search for ', q, error);
            });
    }
    ;

fs.unlink(fileOut, function () {
    searchAppend({q: '_type:visualization'});
    searchAppend({q: '_type:dashboard'});
    searchAppend({q: '_type:search'});
    searchAppend({
        body: {
            query: {
                bool: {
                    should: [
                        {match: {_type: "index-pattern"}},
                        {match: {_id: "tweets"}}
                    ]
                }
            }
        }
    });
});

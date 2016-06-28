var elasticsearch = require('elasticsearch');
var readline = require('readline');
var fs = require('fs');
var elasticdump = require('elasticdump');
var _ = require('lodash');
var Promise = require('promise');

var esHost = '192.168.99.100'
var tweetIndex = 'tweets';
var tweetType = 'example_1_X';
var tweetFile = 'data/tweets.jsonl';
var kibanaFile = 'data/kibana.jsonl';


var client = new elasticsearch.Client({
    host: esHost + ':9200',
    log: 'warning'
});


var esLoad = function (index, type, file) {
    var rd = readline.createInterface({
        input: fs.createReadStream(file),
        output: process.stdout,
        terminal: false
    });

    var loadContent = function () {
        if (content.length == 0) {
            return;
        }
        var n = content.length / 2;
        var locContent = _.clone(content);
        client.bulk({
            body: locContent
        }, function (error, response) {
            if (error) {
                console.error('Error when loading bulk for ', index, error);
                return;
            }
            console.log('loading', n, 'element from ', file, ' (', index, '/', type, ') elements took', response.took);
        });
    };

    var content = [];
    var i = 1;
    rd.on('line', function (line) {
        var doc = JSON.parse(line);
        var id = doc._id || i;

        content.push({
            index: {
                _index: index || doc._index,
                _type: type || doc._type,
                _id: id
            }
        });
        delete doc._index;
        delete doc._type;
        delete doc._id;
        if (doc._source) {
            doc = doc._source;
        }
        content.push(doc);
        i++;

        if ((i - 1) % 1000 === 0) {
            loadContent();
            content = [];
        }
    });
    rd.on('close', function () {
        loadContent();
    })
};

var esLoadTweets = function () {
    esLoad(tweetIndex, tweetType, tweetFile);
};

var esLoadKibana = function () {
    esLoad(undefined, undefined, kibanaFile);
};


var esSetDefault = function () {
    client.search(
        {
            index: '.kibana',
            type: 'config'
        }
    ).then(function (response) {
        var ids = _.map(response.hits.hits, '_id');
        return ids;
    }).then(function (ids) {
        return Promise.all(_.map(ids, function(id){
            return client.update({
                index: '.kibana',
                type: 'config',
                id: id,
                body: {
                    doc: {defaultIndex: tweetIndex}
                }
            });
        }));
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.error('error while updating config', error)
    });
};

var pESReady = new Promise(function (fullfill, reject) {
    var i = 0;
    var nMax = 20;
    var interv = setInterval(function () {
        i += 1;
        if (i == nMax) {
            console.error('waited for ElasticSearch cluster to come up too long');
            clearInterval(interv);
            reject('waited ElasticSearch cluster to come up too long');
            return;
        }
        client.info(function (error) {
            if (error) {
                console.log('waiting for ElasticSearch cluster...');
                return;
            }
            clearInterval(interv);
            fullfill();
        });
    }, 3000);
});

pESReady.then(function () {
    client.search({
        index: tweetIndex,
        type: tweetType

    }, function (error, response) {

        if (error && error.status != 404) {
            console.error('Error when searching for ', tweetIndex, '/', tweetType);
            console.error(error);
            return;
        }

        if (response && response.hits && response.hits.total !== 0) {
            console.log('data are already loaded. exiting');
            return;
        }

        console.log('loading initial data');

        esLoadTweets();
        esLoadKibana();
        esSetDefault();

    });
});
#!/usr/bin/env perl
#gunzip -c  ~/dev/bigdata/cff_bigdata_poc/devtools/cff-mock-feeder/resources/cff-stop-2016-02-29__.jsonl.gz  | head -1000000 | jq "{stopStation:.stop.station, name,to, operator, departure:.stop.departure, departureTimestamp:.stop.departureTimestamp, delay:.stop.delay,to,prognosis:.stop.prognosis,timestamp:.timeStamp}" --compact-output > data/train-stationboard-summary.jsonl
#gzip data/train-stationboard-summary.jsonl
#gunzip -c  data/train-stationboard-summary.jsonl.gz  | ./load-bulk.pl

use Search::Elasticsearch;
use JSON;
  
my $es   = Search::Elasticsearch->new(
nodes => [
    'http://es_admin:admin1@192.168.99.100:9200'
]
	
);
my $bulk = $es->bulk_helper(
    index   => 'cff_summary',
    type    => 'stationboard_event'
);

my  $json = JSON->new->allow_nonref;
while(<STDIN>){
	chomp;
	my $o = decode_json $_;
	$bulk->create_docs($o);
}
$bulk->flush();

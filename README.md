# developping kibana plugins

an infra + dev setup + examples

## Infra

`docker-compose.yml` get the config for elasticsearch, kibana, jenkins 

Once docker is installed on your machine, a docker machine ready (hereby named `default`), let's start the container set:

    export DOCKER_MACHINE=default
	eval $(docker-machine env $DOCKER_MACHINE)
	docker-compose build
	docker-compose up
	
Once everything is up, we can populate data

    gunzip -c  ~/dev/bigdata/cff_bigdata_poc/devtools/cff-mock-feeder/resources/cff-stop-2016-02-29__.jsonl.gz  | ./load-bulk.pl
	
QQQ how to integrate some data in ES + default index into kibana right from docker definition

## Developping

Developping plugins is easier when we have a local kibana server running on the developper host machine. Plugin source code must be with the `installedPlugins` and not mounted via symlink, for auto refresh.
The idea is to download kibana and launch it with a reference to the docker deployed elasticsearch.

Head to https://www.elastic.co/downloads/kibana and download the latest 4.x kibana, untar it in your developement directory

    cd kibana-4.5.1-darwin-x64  # or your ownn kibana directory
	cd installedPlugins/
	git clone QQQ
	git clone QQQ
	cd ..
	bin/kibana --dev --elasticsearch=http://$(docker-machine ip default):9200
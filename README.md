# Developing Kibana plugins

Developing Kibana plugins (QQQ add context)
* Kibana in dev mode for local plugin development. Plugins refreshed upon save.
* Continuous deployment tested locally. Code deployed upon commit via Jenkins listening to git events.

## Continuous deployment setup

First install Docker locally, see Docker documentation for instructions (https://docs.docker.com/engine/installation/).

To setup the continuous deployment environment for Kibana plugins development, clone the current repository:

	git clone https://github.com/alexmasselot/kibana-plugin-howto-infra.git
	cd kibana-plugin-howto-infra

The configuration for Elasticsearch, Kibana, Jenkins  is specified in `docker-compose.yml`

Now the Docker container can be started:

    export DOCKER_MACHINE_NAME=kibanahowto
	docker-machine create --driver=virtualbox --virtualbox-memory 4096 --virtualbox-cpu-count 2 --virtualbox-host-dns-resolver $DOCKER_MACHINE_NAME
	eval $(docker-machine env $DOCKER_MACHINE_NAME)
	docker-compose build	
	echo "when up is completed, please direct your browser to http://$(docker-machine ip $DOCKER_MACHINE_NAME):5601/app/kibana#/dashboard/kibana-howto-plugin?_g=(refreshInterval:(display:Off,time:(from:'2016-06-17T10:30:12.574Z',mode:quick,to:'2016-06-17T10:36:14.545Z'),value:0),time:(from:now-15m,mode:quick,to:now))"
	docker-compose up


### What have you just done???

You have deployed an Elasticsearch server, a Kibana and a Jenkins servers for continuous deployment.
Demo data is populated in Elasticsearch and a visualization is available in Kibana through default dashboard.

To access the servers in the container, you can find the IP address of the docker-machine with the following command:
	docker-machine ip $DOCKER_MACHINE_NAME

The different services are accessible here:

 * http://my_docker_ip:5601 for a Kibana, or for a direct dashboard access:  http://my_docker_ip_:5601/app/kibana#/dashboard/kibana-howto-plugin?_g=(time:(from:'2016-06-17T10:30:12.574Z',mode:quick,to:'2016-06-17T10:36:14.545Z'))
 * http://my_docker_ip:8080 for Jenkins continuous integration & deployment
 * http://my_docker_ip:9200 for ElasticSearch server

Allow a couple minutes for the data to warm up.
You have setup the environment for continuous deployment of Kibana plugins.


## Developing new Kibana plugins

The real fun starts when you modify the plugins, this happen in other git repositories.
To create new Kibana plugins, you need to clone a fresh Kibana server running in development mode and one git repository per plugin. The new plugins are packaged and reinstalled automatically via Jenkins embedded in the docker-machine.

*NB:* if you wish to modify the plugin code, you need to fork the plugin directories and edit the Jenkins jobs to update the git urls. (QQQ detail how to do it kibana-plugin-howto-infra/jenkins/data/jenkins_home/jobs)

### Setup

A local version of Node.js is required. For easier version management of Node.js, you can use [nvm](https://github.com/creationix/nvm#install-script).
This code was written with Node.js 4.4.
To install Node.js version 4.4:

    nvm install 4.4

Next install a Kibana server. That server will run in development mode to visualize the modification of the plugins as they happen. To enable auto-refresh of the plugins, the source code must be in the directory `installedPlugins` and **not** mounted via symlink.

	git clone https://github.com/elastic/kibana
	cd kibana
	git checkout 4.5

	#setup node 4.4 to be used
	nvm use 4.4

*fork* or clone the plugin directory so plugins will be reloaded on the local Kibana server upon every file save action.
	cd installedPlugins/
	git clone https://github.com/alexmasselot/kibana-howto-plugin-clock.git
	git clone https://github.com/alexmasselot/kibana-howto-plugin-format-tweet-text.git
	git clone https://github.com/alexmasselot/kibana-howto-plugin-viz-data-country.git

install npm dependencies for all plugins
	`for p in kibana-howto-plugin-*; do pushd $p; npm install; popd; done`


start the local Kibana in development mode (autorefresh the plugins when source changes)
	cd ..
	npm install
	bin/kibana --dev --elasticsearch=http://$(docker-machine ip $DOCKER_MACHINE_NAME):9200

And we have a Kibana running on locahost.

  * Head to http://localhost:5601
  * select the `tweets` index (in the left column to be the default one - star)
  * go to dashboard
  * open the kibana-plugin-howto-dashboard
  * you may have to go in the past (june 2016) to select the time frame with data


# Doker nuts and bolts

##Setting initial data

It's the most comfortable to warm up the system with data. For development or testing, this is an important step.

### Preparing data

It's a chicken and egg problem.
We must have a Kibana dashboard with searches & visualizations ready. The export them in dump. Finally, when booting up those dumps must be reimported.

#### Exporting
##### tweets (data)

##### Kibana
everything with kibana-howto in the id + index default

#### Importing
in the Cokerfile

### Uploading them (if needed)

# Further readings

 * http://logz.io/blog/kibana-visualizations/
 * https://www.elastic.co/elasticon/2015/sf/contributors-guide-to-the-kibana-galaxy
 * https://www.elastic.co/elasticon/conf/2016/sf/how-to-build-your-own-kibana-plugins
 * http://clb.demon.fi/files/RectangleBinPack.pdf
 * http://perfspy.blogspot.ch/2014/11/custom-kibana.html

# developping kibana plugins

an infra + dev setup + examples

## Infra

`docker-compose.yml` get the config for elasticsearch, kibana, jenkins 

Once docker is installed on your machine, a docker machine ready (hereby named `default`), let's start the container set:

	git clone https://github.com/alexmasselot/kibana-plugin-howto-infra.git
	cd kibana-plugin-howto-infra

    export DOCKER_MACHINE_NAME=kibanahowto
	docker-machine create --driver=virtualbox --virtualbox-memory 4096 --virtualbox-cpu-count 2 --virtualbox-host-dns-resolver $DOCKER_MACHINE_NAME
	eval $(docker-machine env $DOCKER_MACHINE_NAME)
	docker-compose build
	docker-compose up
	
### What have you just done???

You have deployed an elaticsearch server, a kibana and a jenkins server for continuous deployment.
Demo data is populated into the elastic search and kibana is setup with visualization and a default dashboard.

If `my_docker_ip?` is your current docker IP address (`docker-machine ip $DOCKER_MACHINE_NAME`), you can head to:

 * http://my_docker_ip:5601 for a Kibana, or for a direct dashboard access:  http://my_docker_ip_:5601/app/kibana#/dashboard/kibana-howto-plugin?_g=(time:(from:'2016-06-17T10:30:12.574Z',mode:quick,to:'2016-06-17T10:36:14.545Z'))
 * http://my_docker_ip:8080 for Jenkins continuous integration & deployment
 * http://my_docker_ip:9200 for ElasticSearch server
 
Allow for a couple minutes for the data to warm up, you ready to go.

### What can you do at this time?

No really much, apart from playing around with Kibana (hanging the search terms, for example).
But the real fun starts when you go for modifying the pugins


## Developping

The development per se is to be done in another directory, as it will imply cloning a freash kibana server and the various code plugin.
The idea is to have a Kibana server in development mode on the developer laptop, to fastened the feedback loop.

However, the deployment infra is close by (launched via the `docker-compose`) and the plugin code can be packaged and reinstalled by the embedded jenkins.

*NB:* if you wish to modify the plugin code, you will need to fork the plugin directories and edit the jenkins jobs to udate the git urls.

### Requirements
A recent enough node.js is necessary (4.4 was used at the time of writing).
Install [nvm](https://github.com/creationix/nvm#install-script) for an easier nodejs version management.
To install node.js version 4.4, simply:

    nvm install 4.4

### Setup

Developping plugins is easier when we have a local kibana server running on the developper host machine.
Plugin source code must be with the `installedPlugins` and not mounted via symlink, for auto refresh.
The idea is to download kibana and launch it with a reference to the docker deployed elasticsearch.



	cd ~/tmp
	git clone https://github.com/elastic/kibana
	cd kibana
	git checkout 4.5
	
	#setup node 4.4 to be used
	nvm use 4.4
	
	#*fork* or clone the plugin directory so they will be reloaded on the local kibana at every file save
	cd installedPlugins/
	git clone https://github.com/alexmasselot/kibana-howto-plugin-clock.git
	git clone https://github.com/alexmasselot/kibana-howto-plugin-format-tweet-text.git
	git clone https://github.com/alexmasselot/kibana-howto-plugin-viz-data-country.git
	
	#install npm dependencies for all plugins
	for p in kibana-howto-plugin-*; do pushd $p; npm install; popd; done


	#start the local kibana in development mode (autorefresh the plugins when source changes)
	cd ..
	npm install
	bin/kibana --dev --elasticsearch=http://$(docker-machine ip $DOCKER_MACHINE_NAME):9200

And we have a kibana running on locahost.
 
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

##### kibana
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
 
	
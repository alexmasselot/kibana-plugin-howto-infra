# developping kibana plugins

an infra + dev setup + examples

## Infra

`docker-compose.yml` get the config for elasticsearch, kibana, jenkins 

Once docker is installed on your machine, a docker machine ready (hereby named `default`), let's start the container set:

    export DOCKER_MACHINE=default
	eval $(docker-machine env $DOCKER_MACHINE)
	docker-compose build
	docker-compose up
	
### What have you just done???


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

Head to https://www.elastic.co/downloads/kibana and download the latest 4.x kibana, untar it in your developement directory

    cd kibana-4.5.1-darwin-x64  # or your ownn kibana directory
	cd installedPlugins/
	git clone https://github.com/alexmasselot/kibana-howto-plugin-clock.git
	git clone https://github.com/alexmasselot/kibana-howto-plugin-format-degree.git
	cd ..
	
	nvm use 4.4
	bin/kibana --dev --elasticsearch=http://$(docker-machine ip default):9200


# Further readings

 * http://logz.io/blog/kibana-visualizations/
 * https://www.elastic.co/elasticon/2015/sf/contributors-guide-to-the-kibana-galaxy
 * http://clb.demon.fi/files/RectangleBinPack.pdf
 
	
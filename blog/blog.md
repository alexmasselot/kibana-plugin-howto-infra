# A Journey in Writing & Deploying Kibana Plugins (riding Docker)

The ElasticSearch has grown from a Lucene evolution to a full fledged distributed dcoument store, with powerful storage, search and aggregation capabilities.
Kibana definiteley brought a strong component for interative searching and visualization and brought athe data storage tier into an end user browser.

Customizable dashboard via a rich library of graphical components made its success, but soon, the need for customization arose.
If plugins were thought to be integrated from early on, the actual customisation often lied into forking the master project and adapting to on particular purpose [REFREF daunting].
Merging back fixes was soon to be a daunting effort to keep up with the high pace of the [github evolution](https://github.com/elastic/kibana/graphs/contributors).

Fortunately, as of version 4.3, the Kibana project took a more structured way to integrate custom plugins.
The promise of maintainable pluggable plugins was becoming true.
Those pugins, writen in JavaScript, can be as simple as a standalone widget (e.g. a clock), a field formater (an up/down arrow instead of positive/negative number), a graphical representation of a search result (a chart) or a full blown application.

So, that should be easy. Just google and you would make wonderful shiny visualizations.

But not fast, young Kibana Padavan!
Documentation lacks, resources are valuable but scarce.
But the promise is still shiny and we want to reach it.

In this post, we propose to share our journey into the writing of Kibana plugins, the liltle pitfalls we fell in and the setup of continuous deployment into a Docker environment.
There is no dramatic discovery or stunning breakthrough here, but simply a list of pitfalls we had to overcome during our quest.

-----------------

## The purpose of the quest
The goals was to meet the Kibana 4.3+ promise, to be able to customize the platform without forking the orignal code branch.

Our *Definition of Done* was:

 * we should develop different plugin types: independant widget, formatters, aggregation visualization. Hints: at this stage, they don't need to be pretty or particularly meaningful;
 * they should be resizable and offer the classic comfort of the classic Kibana experience; 
 * we should be able to build and deploy them via Jenkins or such;
 * we want to use Docker to run Jenkins, ElasticSearch, a deployed Kibana;
 * with Docker, we want the infrastructure to start with preloaded data and visualization, to let user driven or automated test to happen;
 * we want the plugin development itself to be as smooth as possible (reload time when source code has changed);
 * we want other to be able to reproduce.
 * we want to be able to give a feedback on which extent the technology is mature for a full blown project.
 
![deployed plugins](images/dashboard-overall.png)

*Figure 1:* the deployed dashboard with custom plugins, from upper left to lower right:
a) a simple clock;
b) the default date historgram to allow for time range narrowing;
c) an aggregation visualization;
d) a search results with a custom formatter.
 
### Wasn't there any full detailed map available?
If there had been one, this whole effort would have been a straight tweet: *"amazing tutorial on how to build and deploy #kibana plugins #elasticsearch http://wonder.land/build/your/own/kibana/plugins."*
Obviously, there was none.
 
However, there were instructive and inspiring sources of information.
Although there might have been incomplete, slightly out of date or simply at a too high level, we cannot thank their authors enough for having put us on track.
 
 * Enlightening talks from the ElastiCon conferences in San Francisco, [2015](https://www.elastic.co/elasticon/2015/sf/contributors-guide-to-the-kibana-galaxy) and [2016](https://www.elastic.co/elasticon/conf/2016/sf/how-to-build-your-own-kibana-plugins). Way more blasting presentations are available there!
 * The most comprehensive piece of documentation at the time and ubiquituously cited, [a four parts post by Tim Roe](https://www.timroes.de/2015/12/02/writing-kibana-4-plugins-basics/). Although pretty descriptive, some information was missing, the commited code not fully working straightforwards (Kibana version?).

## The Journey log book

For the impatient, head to git (https://github.com/alexmasselot/kibana-plugin-howto-infra) and follow the instructions and have it running on your laptop.


### The architecture
To fullfill our quest, we need at least:

  * github to hold the plugins source code;
  * a local development Kibana server, where plugins are refreshed upon saved;
  * an ElasticSearch server, to store test data, and Kibana configurations;
  * an integration Kibana, where packaged plugins are deploye canonically;
  * Jenkins for continuous integration, to pull plugin source code from github, packaged those plugins and deploy them on the integration Kibana server.

For the sake of isolating an integration environment, we propose in figure 2 to setup a Docker container set with Jenkins, ElasticSearch and the integration Kibana, while the development Kibana instance runs locally.
This is of course only an example setup, we won't claim by far it is thebest, but we believe it is sufficient to make our point.

![architecture](images/archi.png)

We will now walk through this architecture, see how to deploy it and how the initial data (a list of tweets) and configuration (Kibana and Jenkins) are seed.

### Docker infrastructure
Docker is a powerful container platform to encapsulate lightweight containers.
Perfectly suited for development, one can easily build upon pre-existing images (e.g. a *Kibana v4.5.1*), then custom them via `DockerFile` (e.g. tuning configuration).
(`docker-compose`)[QQQ] push the system even further, as it allows to generate a full set of containers with a private network, while some ports and volume are exposed to the outside world.
In the age of micro services and multi tenant architectures, we believe that lightweight container systems have deeply altered the developper's life.
The project presented here is a typical example of such architectures.

#### Spawning the infrastructure
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
	docker-compose up

#### What have you just done???

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

####Populating initial data and configuration
The containers boots already configured.
Jenkins shows jobs ready to be ran.
ElasticSearch contains 10'000 tweets with geographic coordinates.
Kibana is available with default dashboard, searches, visualizations and plugins.

We believe that only the seamless integrations process have a chance of being adopted by fellow developpers.
Remember Larry Wall (Programming Perl, 2nd edition, 1996), laziness, together with impatience and hubris, is one of the three virtues of a good developer.

As described earlier, initial configurations are instanciated via `DockerFile`



 	
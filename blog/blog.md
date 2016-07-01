# Writing & deploying Kibana plugins (with Docker)

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

In this post, we propose to share our journey into the writing of Kibana plugins, the setup of continuous deployment into a Docker environment.
There is no dramatic discovery or stunning breakthrough here, but simply a list of pitfalls we had to overcome during our quest.

-----------------

## The purpose of the quest
The goals was to meet the Kibana 4.3+ promise, and to be able to customize the platform without forking the orignal code branch.

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
 
 ### Wasn't there any full track map?
 If there had been one, this whole effort would have been a straight tweet: *"amazing tutorial on how to build and deploy #kibana plugins #elasticsearch http://wonder.land/kibana/plugin."*
 Obviously, there was none.
 
 However, there were instructive and inspiring sources of information.
 Although there might have been incomplete, slightly out of date or simply at a too high level, we cannot thank their authors enough for having put us on track.
 
  * Enlightening talks from the ElastiCon conferences in San Francisco, [2015](https://www.elastic.co/elasticon/2015/sf/contributors-guide-to-the-kibana-galaxy) and [2016](https://www.elastic.co/elasticon/conf/2016/sf/how-to-build-your-own-kibana-plugins). Way more blasting presentations are available there!
  * The most comprehensive piece of documentation at the time and ubiquituously cited, [a four parts post by Tim Roe](https://www.timroes.de/2015/12/02/writing-kibana-4-plugins-basics/). Although pretty descriptive, some information was missing, the commited code not fully working straightforwards (Kibana version?).
  
 	
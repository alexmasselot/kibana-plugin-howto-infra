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

-----------------

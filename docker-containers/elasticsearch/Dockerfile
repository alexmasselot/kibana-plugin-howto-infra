FROM elasticsearch:2.3.0

RUN rm -rf /etc/elasticsearch
RUN ln -s /usr/share/elasticsearch/config /etc/elasticsearch

RUN /usr/share/elasticsearch/bin/plugin install license
RUN /usr/share/elasticsearch/bin/plugin install watcher
#RUN /usr/share/elasticsearch/bin/plugin install shield

#RUN /usr/share/elasticsearch/bin/shield/esusers useradd es_admin -p admin1 -r admin
#RUN bin/shield/esusers useradd kibana4-server -r kibana4_server -p password




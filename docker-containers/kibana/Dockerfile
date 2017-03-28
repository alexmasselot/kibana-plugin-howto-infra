FROM docker.elastic.co/kibana/kibana:5.2.2

#RUN kibana plugin --install elastic/sense
#RUN kibana plugin --install kibana/shield/latest
#RUN kibana plugin --install elastic/marvel/latest

ENV PATH="/usr/share/kibana/node/bin:${PATH}"

RUN kibana-plugin install https://github.com/alexmasselot/kibana-howto-plugin-clock/raw/master/build/simple_clock-5.2.2.zip
RUN kibana-plugin install  https://github.com/alexmasselot/kibana-howto-plugin-viz-data-country/raw/master/build/viz_data_country-5.2.2.zip
RUN kibana-plugin install https://github.com/alexmasselot/kibana-howto-plugin-format-tweet-text/raw/master/build/simple_twitter-5.2.2.zip


USER root
#RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf
#RUN ping -c 2 www.google.com

RUN apt-get update
RUN apt-get install -y openssh-server
RUN update-rc.d ssh defaults


USER kibana
ADD .ssh /home/kibana/.ssh

USER root
RUN chown -R kibana /opt/kibana
RUN chown -R kibana /home/kibana/.ssh
RUN chmod go-rwx /home/kibana/.ssh


EXPOSE 22

#COPY ./entrypoint.sh /
#ENTRYPOINT ["bash", "/entrypoint.sh"]
#CMD ["kibana"]

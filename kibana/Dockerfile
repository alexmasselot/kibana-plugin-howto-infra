FROM kibana:4.5

RUN kibana plugin --install elastic/sense
#RUN kibana plugin --install kibana/shield/latest
#RUN kibana plugin --install elastic/marvel/latest

RUN kibana plugin --install simple_clock -u https://github.com/alexmasselot/kibana-howto-plugin-clock/raw/master/build/simple_clock-0.1.8.zip
RUN kibana plugin --install simple_data_viz -u https://github.com/alexmasselot/kibana-howto-plugin-viz-data-country/raw/master/build/simple_data_viz-0.1.1.zip
RUN kibana plugin --install simple_twitter -u https://github.com/alexmasselot/kibana-howto-plugin-format-tweet-text/raw/master/build/simple_twitter-0.1.0.zip


RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf
RUN ping -c 2 www.google.com

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

COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["kibana"]

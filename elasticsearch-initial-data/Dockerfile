FROM node-4

#RUN apt-get install curl
RUN apk add --no-cache curl
RUN apk add --no-cache bash
RUN apk add --no-cache jq

COPY ./entrypoint.sh /
COPY ./data /data


ENTRYPOINT ["bash", "/entrypoint.sh"]
FROM node:4

#RUN apt-get install cu


COPY . /usr/src
WORKDIR /usr/src
RUN npm install

#ENTRYPOINT ["bash", "/entrypoint.sh"]
ENTRYPOINT ["node", "entrypoint.js"]

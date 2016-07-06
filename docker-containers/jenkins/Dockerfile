FROM jenkins



USER jenkins
WORKDIR /var/jenkins_home/
RUN touch .profile

#RUN wget -O - https://raw.githubusercontent.com/creationix/nvm/v0.11.1/install.sh | bash
#
#ENV NVM_DIR /var/jenkins_home/.nvm
#RUN echo " . /var/jenkins_home/.nvm/nvm.sh " >> .bashrc

RUN rm -f /var/jenkins_home/.ssh/known_hosts

COPY /data/plugins.txt /usr/share/jenkins/plugins.txt
RUN /usr/local/bin/plugins.sh /usr/share/jenkins/plugins.txt




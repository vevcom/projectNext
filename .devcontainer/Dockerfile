FROM node:20-bookworm

RUN apt update
RUN apt install ca-certificates curl gnupg dpkg lsb-release -y
RUN install -m 0755 -d /etc/apt/keyrings 
RUN curl -sS https://download.docker.com/linux/debian/gpg | gpg --dearmor > /usr/share/keyrings/docker-ce.gpg
RUN chmod a+r /usr/share/keyrings/docker-ce.gpg
RUN echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-ce.gpg] https://download.docker.com/linux/debian $(lsb_release -sc) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt update

RUN apt install docker.io docker-compose-plugin -y

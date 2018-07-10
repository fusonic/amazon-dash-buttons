FROM ubuntu:xenial

MAINTAINER Fusonic "office@fusonic.net"

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -yyq libpcap-dev git npm python make nodejs-legacy \
    && rm -rf /tmp/* /var/tmp/* /var/lib/apt/lists/* /usr/share/man

COPY files /
WORKDIR /opt/dash-button
RUN npm install

CMD /boot

FROM ubuntu:xenial

MAINTAINER Fusonic "office@fusonic.net"

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install curl -yyq && curl -sL https://deb.nodesource.com/setup_8.x | bash \
    && apt-get update \
    && apt-get install -yyq libpcap-dev git python make nodejs build-essential \
    && rm -rf /tmp/* /var/tmp/* /var/lib/apt/lists/* /usr/share/man

COPY files /
WORKDIR /opt/dash-button
RUN node -v && npm -v && npm install

CMD /boot

FROM centos:centos7
MAINTAINER Gastón Sánchez

RUN yum install -y epel-release
RUN yum install -y git make nodejs npm

EXPOSE 8080

WORKDIR /var/www

CMD ["/bin/bash"]

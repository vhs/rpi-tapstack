#
# Build binary with build dependencies
#
FROM raspbian/stretch AS build

RUN apt-get update && apt-get upgrade -y && apt-get install -y curl git cmake automake autoconf libtool pkg-config build-essential

## Install libnfc 
RUN mkdir -p /usr/local/src

WORKDIR /usr/local/src

RUN git clone https://github.com/NXPNFCLinux/linux_libnfc-nci.git

WORKDIR /usr/local/src/linux_libnfc-nci

RUN ./bootstrap && ./configure --enable-alt && make && make install

## Install node and rpi-stack node modules
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -

RUN apt-get update && apt-get install -y nodejs

RUN mkdir -p /var/run/rpi-tapstack

WORKDIR /var/run/rpi-tapstack

ADD . .

RUN npm install

#
# Build main image
#
FROM raspbian/stretch

RUN apt-get update && apt-get upgrade -y && apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -

RUN apt-get update && apt-get install -y nodejs

COPY --from=build /usr/local /usr/local
COPY --from=build /var/run/rpi-tapstack /var/run/rpi-tapstack

WORKDIR /var/run/rpi-tapstack

CMD npm start

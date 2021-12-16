FROM node:16

WORKDIR /usr/src/clean_node_api

COPY ./package.json .

RUN npm install --only=prod
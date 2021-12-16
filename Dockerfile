FROM node:16

WORKDIR /usr/src/clean_node_api

COPY ./package.json .
RUN npm install --only=prod

COPY ./dist ./dist

EXPOSE 5000

CMD ["npm start"]
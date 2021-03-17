FROM node:10.11.0-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV PORT 9010
EXPOSE $PORT
CMD [ "npm", "start" ]

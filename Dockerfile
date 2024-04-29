FROM node:alpine As development

WORKDIR /usr/src/app

RUN nom install

COPY . .

RUN npm run build


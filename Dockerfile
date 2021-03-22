FROM node:14-alpine

LABEL author="Department for Environment, Food & Rural Affairs"

ENV NODE_ENV=production
ENV PORT=3000

RUN apk update && apk add bash

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE $PORT

ENTRYPOINT [ "npm", "start" ]

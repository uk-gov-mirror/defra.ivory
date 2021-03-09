FROM node:14-alpine

LABEL author="Department for Environment, Food & Rural Affairs"

ENV NODE_ENV=prod
ENV PORT=3000

WORKDIR /app

COPY . .

RUN npm install

EXPOSE $PORT

ENTRYPOINT [ "npm", "start" ]

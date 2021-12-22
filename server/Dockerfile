# Build
FROM node:16-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
# Deploy
FROM node:16-alpine
RUN apk add dumb-init
# ENV NODE_ENV development # Set in docker-compose
EXPOSE 5000
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app
CMD ["dumb-init", "node", "server.js"]
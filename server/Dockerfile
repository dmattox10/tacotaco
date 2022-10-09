# Build, get seed data
FROM node:16-alpine AS build
RUN apk --no-cache add git
WORKDIR /usr/src/app
COPY . .
RUN yarn
# RUN cd data && git clone --depth=1 https://github.com/dansinker/tacofancy.git
# RUN yarn migrate

# Migrate and Seed the DB
FROM node:16-alpine AS migrations
WORKDIR /usr/src/app/
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/data/tacotancy /usr/src/app/data/tacofancy
RUN yarn migrate

# Deploy
FROM node:16-alpine
RUN apk --no-cache add dumb-init
EXPOSE 5000
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app
CMD ["dumb-init", "node", "server.js"]
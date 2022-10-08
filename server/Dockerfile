# Build, get seed data, migrate
FROM node:16-alpine AS build
RUN apk --no-cache add git
WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN cd data && git clone --depth=1 https://github.com/dansinker/tacofancy.git
RUN yarn migrate

# Seed
FROM node:16-alpine AS seed
WORKDIR /usr/src/app/
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/data/tacotancy /usr/src/app/data/tacofancy
RUN yarn seed

# Deploy
FROM node:16-alpine
RUN apk --no-cache add dumb-init
EXPOSE 5000
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app
CMD ["dumb-init", "node", "server.js"]
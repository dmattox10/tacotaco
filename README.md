# MMMMMM Tacos.
This API will serve up delicious combinations (with config options) of tacos!
<hr>

live [HERE](https://tacotaco.danielmattox.com)

for now, email me for an API key if you would like to POST on my instance.

<hr>

## About this project

__Motivation__

Come on, tacos! 

There is an API using this data listed in several places but the applications wasn't functioning so I built a backend to provide:
- A random prebuilt taco
- A random taco using one of each category of ingredients
- A custom taco randomly selecting a chosen number of ingredients in each category

__Tech__
- Express
- MongoDB❤️

__Execution__

All of the data was in markdown, so I set about pulling that into a DB, and I decided to store it as rendered HTML, so there's a bit of server side rendering for the client, by design.

__What I Learned__

- Traverse directories and build a list
- Read each file from the list in and determine if we want it based on extension, and filename (exclude README files)
- Populate the DB from the list of files we want
- Parse markdown files (a shame there's no metadata!)

## Getting Started
APP_PORT must match SECOND port declaration in docker-compose.yml

Set the BYPASS_SECRET to send a predetermined passphrase or set SHARED_SECRET and REFRESH_SECRET as well as changing the postRoutes to use checkAuth instead of bypassAuth to use a separate JWT auth microservice like my [mx-auth](https://github.com/dmattox10/mx-auth)

Secrets should be sent as __x-auth-token__ in the headers.

__Sample server/.env file__
```
APP_PORT = 5000
APP_NAME = TacoTaco
NODE_ENV = testing
MONGO_HOST = localhost
MONGO_USER = youruser
MONGO_PASS = vanishing_secret
MONGO_PORT = 27017
BYPASS_SECRET = shhh
```
__Sample docker-compose.yml__
    ---
    version: '3.7'

    services:
    server:
        build:
        context: ./server
        dockerfile: Dockerfile
        image: tacotaco-server
        container_name: server
        command: /usr/src/app/node_modules/.bin/nodemon server.js
        volumes:
        - ./server:/usr/src/app
        - /usr/src/app/node_modules
        ports:
        - "5050:5000"
        depends_on:
        - mongo
        env_file: ./server/.env
        environment:
        - NODE_ENV=testing
        networks:
        - tacotaco-network
    mongo:
        image: mongo
        container_name: mongo
        environment: 
        MONGO_INITDB_ROOT_USERNAME: REDACTED
        MONGO_INITDB_ROOT_PASSWORD: REDACTED
        volumes:
        - ./testing/db:/data/db
        ports:
        - "27017:27017"
        networks:
        - tacotaco-network

    networks:
    tacotaco-network:
        driver: bridge

    volumes:
    data-volume:
    node_modules:
    web-root:
        driver: local
__Commands__
```
docker-compose build
docker-compose up -d
```
## Routes

- __GET /taco/complete?id=ID__

This route has an optional ID to get a specific complete taco having been saved by posting /taco/custom with the contents of either a custom or random taco. If no ID is specified, it will get a random user saved taco.

- __GET /taco/custom?__

This route returns a custom taco using query parameters as follows:
```
baseLayers=2&condiments=2&mixins=2&seasonings=2&shells=2
```
this will yield 2 of each of the optional parameters in the taco with a reply such as:
```
{ taco: {
    baseLayers: ARRAY,
    condiments: ARRAY,
    mixins: ARRAY,
    seasonings: ARRAY,
    shells: ARRAY
}}
```
any one of the items in any of those arrays is expected to have the structure:
```
{ _id: ObjectID,
  category: STRING,
  name: STRING,
  html: STRING
}
```
html is the original markdown "card" rendered to html as intended by the author.

- __POST /taco/custom__

This route accepts entries for "Custom", "Random", and "Complete"
This route expects a raw JSON body containing:
```
{
    id: ObjectID,
    ids: ARRAY,
    vote: BOOLEAN,
    name: STRING
}
```
The id is the _id of the custom taco from the GET (if it existed because this route also covers random tacos), ids are all of the components in the taco, the vote is true or false depending on like or dislike, and the name is only able to be edited if the combo was previously without a custom name.

- __GET /taco/full__

This route returns a randomly chosen taco from the list of pre-constructed full taco recipes that exist in the data from tacofancy. 
This route requires special handling contrasting how the other two taco routes are designed to provide a response that can be rendered by the same client logic.
```
{ _id: ObjectID,
  category: STRING,
  name: STRING,
  html: STRING
}
```
html is the original markdown "card" rendered to html as intended by the author.

- __POST /taco/full__

This route allows for likes/dislikes on a full, precreated taco from the tacofancy data. The server expects a raw JSON body containing:
```
{
    id: ObjectID, 
    vote: BOOLEAN
}

- __GET /taco/random__
```
This route returns a randomly chosen taco using one item from each 
category, the outputs in the reply are arrays for consistency.
```
{ taco: {
    baseLayers: ARRAY,
    condiments: ARRAY,
    mixins: ARRAY,
    seasonings: ARRAY,
    shells: ARRAY
}}
```

- __GET /taco/capabilities__

This route is for the benefit of a front end client, providing a rudimentary way of preventing any request from exceeding the number of available items, as there is no handling for this built into the server [TODO]
```
{ server: { 
    uid: STRING,
    quantities: {
    baseLayers: NUMBER,
    condiments: NUMBER,
    mixins: NUMBER,
    seasonings: NUMBER,
    shells: NUMBER
}}}
```
uid is intended for the client to send back to differentiate unique users without cookies or other tracking analytics.

#### Credits:
- Taco Data in server/data/tacofancy from https://github.com/sinker/tacofancy.git

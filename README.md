# MMMMMM Tacos.
This API will serve up delicious combinations (with config options) of tacos!
<hr>

live [HERE](https://tacotaco.danielmattox.com)

<hr>

## About this project

__Motivation__

Come on, tacos! 

There is an API using this data listed in several places but the application wasn't functioning so I built a backend to provide:
- A random prebuilt taco
- A random taco using one of each category of ingredients
- A custom taco randomly selecting a chosen number of ingredients in each category

__Tech__
- Express
- ~~MongoDB❤️~~ This is another project that got a large rewrite to SQL because you should hire me.

__Execution__

All of the data was in markdown, so I set about pulling that into a DB, and I decided to store it as markdown-rendered HTML.

__What I Learned__

- Fighting feature creep, holding to the specific purpose to ensure the project gets finished.
- Traverse directories and build a list of them
- Read each file from the list in and determine if we want it based on extension, and filename (exclude README files)
- Populate the DB from the list of files we want
- Parse markdown files (a shame there's no metadata!)
- Store large JSON in the DB.

__The Butt__
I don't remember why, but I just noticed that the entries categorized as "like tacos" are excluded back when I first created this, from the seeding data. I'm guessing there's some naming convention that was different for this category, I'll get right on that /s.

## Getting Started
APP_PORT must match SECOND port declaration in docker-compose.yml

Set the BYPASS_SECRET to send a predetermined passphrase or set SHARED_SECRET and REFRESH_SECRET as well as changing the postRoutes to use checkAuth instead of bypassAuth to use a separate JWT auth microservice like my [mx-auth](https://github.com/dmattox10/mx-auth)

Token/Secret should be sent as __accessToken__ in the headers.


<details>
  <summary>Sample server/.env file</summary>
  
```
APP_PORT = 5000
APP_NAME = tacotaco
ENVIRONMENT = development
BYPASS_SECRET = shhh
```
  
</details>
<details>
  <summary>Sample docker-compose.yml</summary>

    ---
    version: '3.7'

    services:
    server:
        build:
        context: ./server
        dockerfile: Dockerfile
        image: tacotaco
        container_name: tacotaco
        hostname: tacotaco
        command: /usr/src/app/node_modules/.bin/nodemon server.js
        volumes:
        - ./server:/usr/src/app
        - /usr/src/app/node_modules
        ports:
        - "5050:5000"
        env_file: ./server/.env


    volumes:
    data-volume:
    node_modules:
    web-root:
        driver: local

</details>

```
docker-compose build
docker-compose up -d
```
## Routes

- __GET /v1/taco/complete?__

This route has an optional ID to get a specific complete taco having been saved by posting /taco/custom with the contents of either a custom or random taco. If an ID of ALL is sent, the entire list will be returned. If no ID is specified, it will get a random user saved taco.
```
complete

complete?id=ALL

complete?id=11 (complete taco id's start at 126 but a client should get a list of completes and present options to a user)

complete?id=133
```

The error handling for this in any client, is to use the length of the tacos ARRAY handed back:
 - 0 - You'll also get back a 404.
 - 1 - This is a taco
 - more than one - This is more than one taco. All of them in fact.
<details>
  <summary>Show sample response</summary>

```{
    "tacos": [
        {
            "id": 126,
            "name": "Asian Style Tacos",
            "category": "full_tacos",
            "path": "../data/tacofancy/full_tacos/asian_style_tacos.md",
            "html": "<h1 id=\"asian-style-tacos\">Asian Style Tacos</h1>\n<p>If you like a lighter asian style taco with no cheese, give this one a try. Use tofu to make these vegetarian-friendly!</p>\n<ol>\n<li>Using the <a href=\"../base_layers/asian_marinade.md\">asian marinade</a>, prepare some tofu or sliced pork</li>\n<li>Make some guacamole (add in a teaspoon of sesame oil and toasted sesame seeds to your recipe)</li>\n<li>Top with <a href=\"../condiments/pickled_vegetables.md\">asian pickled veggies</a></li>\n<li>And <a href=\"../condiments/asian_cabbage.md\">cabbage slaw</a></li>\n<li><strong>NOM</strong></li>\n</ol>\n<p>tags: vegetarian, vegan</p>\n",
            "likes": null,
            "created_at": "2022-09-27 06:27:41",
            "updated_at": "2022-09-27 06:27:41"
        },
        {
            "id": 127,
            "name": "Baja Fish Tacos",
            "category": "full_tacos",
            "path": "../data/tacofancy/full_tacos/baja_fish_tacos.md",
            "html": "....",
            "likes": null,
            "created_at": "2022-09-27 06:27:41",
            "updated_at": "2022-09-27 06:27:41"
        },
        {
            "id": 128,
            "name": "# Beef soft tacos\r",
            "category": "full_tacos",
            "path": "../data/tacofancy/full_tacos/beef_soft_tacos.md",
            "html": "....",
            "likes": null,
            "created_at": "2022-09-27 06:27:41",
            "updated_at": "2022-09-27 06:27:41"
        },
        ....
    ]
}
```

</details>

- __GET /v1/taco/custom?__

This route returns a custom taco using query parameters as follows:
```
baseLayers=2&condiments=2&mixins=2&seasonings=2&shells=2
```
this will yield 2 of each of the optional parameters in the taco with a reply such as:
<details>
  <summary>Show sample response</summary>

```
{
    "taco": {
        "baseLayers": [
            [
                {
                    "id": 42,
                    "name": "# Spaghetti Squash",
                    "category": "base_layers",
                    "path": "../data/tacofancy/base_layers/spaghetti_squash.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                },
                {
                    "id": 33,
                    "name": "Puerco Pibil",
                    "category": "base_layers",
                    "path": "../data/tacofancy/base_layers/puerco_pibil.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                }
            ]
        ],
        "condiments": [
            [
                {
                    "id": 84,
                    "name": "Simple Salsa Verde",
                    "category": "condiments",
                    "path": "../data/tacofancy/condiments/simple_salsa_verde.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                },
                {
                    "id": 65,
                    "name": "Gochujang Cucumbers",
                    "category": "condiments",
                    "path": "../data/tacofancy/condiments/gochjang_cucumbers.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                }
            ]
        ],
        "mixins": [
            [
                {
                    "id": 103,
                    "name": "Pomegranate Seeds",
                    "category": "mixins",
                    "path": "../data/tacofancy/mixins/pomegranate_seeds.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                },
                {
                    "id": 93,
                    "name": "Shredded Brussels Sprouts",
                    "category": "mixins",
                    "path": "../data/tacofancy/mixins/brussels.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                }
            ]
        ],
        "seasonings": [
            [
                {
                    "id": 111,
                    "name": "Mahi Mahi Rub",
                    "category": "seasonings",
                    "path": "../data/tacofancy/seasonings/mahimahirub.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                },
                {
                    "id": 109,
                    "name": "Chipotle Rub",
                    "category": "seasonings",
                    "path": "../data/tacofancy/seasonings/chipotle_rub.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                }
            ]
        ],
        "shells": [
            [
                {
                    "id": 121,
                    "name": "Hard Corn Shells (Traditional; US)",
                    "category": "shells",
                    "path": "../data/tacofancy/shells/hard_corn_traditional_us.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                },
                {
                    "id": 124,
                    "name": "naan",
                    "category": "shells",
                    "path": "../data/tacofancy/shells/naan.md",
                    "html": "....",
                    "likes": null,
                    "created_at": "2022-09-27 06:27:41",
                    "updated_at": "2022-09-27 06:27:41"
                }
            ]
        ]
    }
}
```
</details>
html is the original markdown "card" rendered to html as intended by the author.

#### Credits:
- Taco Data needs cloned into server/data/ (server/data/tacofancy) from https://github.com/sinker/tacofancy.git

# Server

Represents the core back-end server that manages the representation of the ecoverse and all the entities stored wthin it.

Build Status:
![Docker Image CI](https://github.com/cherrytwist/Server/workflows/Docker%20Image%20CI/badge.svg?branch=master)

Build Quality
[![BCH compliance](https://bettercodehub.com/edge/badge/cherrytwist/Server?branch=develop)](https://bettercodehub.com/)

## Server architecture

Cherrytwist server uses [NestJS](https://nestjs.com/) as framework and complies to its principles. The code is split into Data Layer (entities), Data Access Layer (), Service Layer and an API Layer (GraphQL).
Interactions between different layers is depicted in the Layer Diagram below:

![Layer Diagram](diagrams/ct-server-layer-diagram.png)

## Running the server locally (not in a container)

To run the server a working MySQL Server is required.
For **MySQL 8** read [this](#MySQL-Server-specific-configuration-for-version-8).

### Configure the database connection

Default configuration is available. **DO NOT UPDATE `.env.default`**
If you need to specify different configuration, add .env file in project root folder and set values for MYSQL_DATABASE, MYSQL_ROOT_PASSWORD, DATABASE_HOST, GRAPHQL_ENDPOINT_PORT.
Note: Only AAD v2 endpoints and tokens are supported!

Example:

```bash
DATABASE_HOST=localhost
MYSQL_DATABASE=cherrytwist
MYSQL_ROOT_PASSWORD=toor
GRAPHQL_ENDPOINT_PORT=4000

```

Replace the content in [] with the guids from AAD - they can be retrieved from the Azure portal from the app registration page.
Optional variables:

- `MYSQL_DB_PORT` - specifies the MySQL port by default 3306.
- `ENABLE_ORM_LOGGING` -Enable/disable the internal ORM logging .

Example:

```bash
MYSQL_DB_PORT=55000
ENABLE_ORM_LOGGING=true
```

### Configure authentication

Define AAD_TENANT, AAD_CLIENT environment variables - e.g. locally in .env environment. Optionally provide AUTHENTICATION_ENABLED=false for dev purposes (default value is TRUE) to test without AAD.

```bash
AAD_TENANT=[tenant (directory) ID]
AAD_CLIENT= [client (application) ID]
AUTHENTICATION_ENABLED=true
```

Optionally configure CORS origin for improved security with the following env variable (by default the value is *):

```bash
CORS_ORIGIN=[your CORS origin value]
```

### Install dependencies

```bash
npm install
```

### Load the database with sample data if you wish

```bash
npm run data-load-samples
```

### Start the server

```bash
npm start
```

Navigate to <http://localhost:4000/graphql> (4000 is the default port if GRAPHQL_ENDPOINT_PORT is not assigned)

## Setup instructions (docker-compose and docker)

Prerequisites:

- Docker and docker-compose installed on x86 architecture (so not an ARM-based architecture like Raspberry pi)
- ports 80, 4000 (GRAPHQL_ENDPOINT_PORT) and 3306 free on localhost

To run this project:

1. Build the server image, pull mySQL image and start the containers

    ```bash
    docker-compose --env-file .env.docker up -d --build
    ```

    if .env file has been added use:

    ```bash
    docker-compose up -d --build
    ```

2. Populate database with initial data:

    ```bash
    docker exec ct_server npm run data-load-samples
    ```

## Technology Stack

The technology stack is as follows:

- GraphQL: for specifying the interactions with the server, using Apollo server
- Node: for runtime execution
- TypeScript: for all logic
- TypeORM: for the orbject relational mapping
- mySQL: for data persistance
- docker: for containers
- docker-compose: for container orchestration
- passportjs for authentication
- NestJS as a framework
- Azure Active Directory as an Identity Provider

Credit: the setup of this project is inspired by the following article: <https://medium.com/swlh/graphql-orm-with-typescript-implementing-apollo-server-express-and-sqlite-5f16a92968d0>

### MySQL Server specific configuration for version 8

MySQL version 8 by default use `caching_sha2_password` password validation plugin that is not supported by typeORM. The plugin must be changed to 'mysql_native_password'. It can be done per user or default for the server.

If the server is already up and running create new user:

```sql
CREATE USER 'nativeuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

or alter existing one:

```sql
ALTER USER 'nativeuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

For MySQL in docker:

```bash
docker run --name some-mysql \
-p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=my-secret-pw \
-d mysql \
--default-authentication-plugin=mysql_native_password
```

## Pushing code the dockerhub

We have automated the creation and deployment of containers to docker hub via a github action. To automaticly trigger the build up to dockerhub the following steps should be taken:

- Ensure that the code that you would like to create the container from is pushed / merged into the `develop` branch.
- Create a github release and tag it with the appropriate version number ie. `v0.1.3`
- Go to github actions and view the `push to docker` action to see if everything ran correctly.

# Server

Represents the core back-end server that manages the representation of the ecoverse and all the entities stored wthin it.

Build Status:
![Docker Image CI](https://github.com/cherrytwist/Server/workflows/Docker%20Image%20CI/badge.svg?branch=master)

## Running the server locally (not in a container)

To run the server a working MySQL Server is required.
For **MySQL 8** read [this](#MySQL-Server-specific-configuration-for-version-8).

### Configure the database connection

Example default configuration is available in `.env.default`.

To specify configuration, copy `.env.default` to a `.env` file in project root folder and set/adjust values for MYSQL_DATABASE & TYPEORM_DATABASE, MYSQL_ROOT_PASSWORD & TYPEORM_PASSWORD, DATABASE_HOST & TYPEORM_HOST as required.

Example:

```bash
TYPEORM_HOST=localhost
TYPEORM_PASSWORD=toor
TYPEORM_DATABASE=cherrytwist
DATABASE_HOST=localhost
MYSQL_DATABASE=cherrytwist
MYSQL_ROOT_PASSWORD=toor
```

Other variables:

- `TYPEORM_PORT` - specifies the MySQL port by default 3306.
- `TYPEORM_LOGGING` -Enable/disable the internal ORM logging `{true,false}`

Example:

```
TYPEORM_PORT=55000
TYPEORM_LOGGING=true
```

### Install dependencies

```bash
npm install
```

### Initialise the database

```bash
npm run test-db-reset
```

### Start the server

```
npm start
```

Navigate to http://localhost:4000/graphql

## Setup instructions (docker-compose and docker)

Prerequisites:

- Docker and docker-compose installed on x86 architecture (so not an ARM-based architecture like Raspberry pi)
- ports 80, 4000 and 3306 free on localhost

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
    docker exec ct_server npm run test-db-reset
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

Credit: the setup of this project is inspired by the following article: https://medium.com/swlh/graphql-orm-with-typescript-implementing-apollo-server-express-and-sqlite-5f16a92968d0

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

# PostgreSQL-To-MongoDB

Transfer PostgreSQL tables to MongoDB collections.

### Installation

Install the dependencies and devDependencies.

```sh
$ cd PostgreSQL-To-MongoDB
$ npm install
```

### Usage

Change config.json file to your requirments.

```json
{
    "PG_USER": "<pg_username>",
    "PG_HOST": "localhost",
    "PG_PASSWORD": "<pg_password>",
    "PG_DATABASE": "<pg_database>",
    "PG_PORT": 5432,
    "MONGO_URL": "mongodb://localhost:27017",
    "MONGO_DATABASE": "<mongo_database>"
}
```

Run command:

```sh
$ node .
```

## License

ISC

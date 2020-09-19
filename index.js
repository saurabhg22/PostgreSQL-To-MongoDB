const PG = require('pg');
const MongoDB = require('mongodb');
const _ = require('lodash');
const CONFIG = require('./config.json');

const LIMIT = 1000;
let PGClient, db, MongoClient;
const init = async () => {
    PGClient = new PG.Client({
        user: CONFIG.PG_USER,
        host: CONFIG.PG_HOST,
        database: CONFIG.PG_DATABASE,
        password: CONFIG.PG_PASSWORD,
        port: CONFIG.PG_PORT,
    });
    await PGClient.connect();
    MongoClient = await MongoDB.MongoClient.connect(CONFIG.MONGO_URL);
    db = MongoClient.db(CONFIG.MONGO_DATABASE);
    db.dropDatabase();
};

const close = async () => {
    await PGClient.end();
    await MongoClient.close();
};

const getAllTables = async () => {
    const res = await PGClient.query(`
    SELECT * FROM pg_catalog.pg_tables 
    WHERE schemaname != 'pg_catalog' AND 
    schemaname != 'information_schema'`);

    const tables = _.map(res.rows, 'tablename');
    return tables;
};

const getDataFromTable = async (table, from = 0, limit = LIMIT) => {
    const res = await PGClient.query(`
    SELECT * FROM ${table}
    LIMIT ${limit} OFFSET ${from}`);

    return res.rows;
};

const getTotalCount = async (table) => {
    const res = await PGClient.query(`
    SELECT COUNT(*) FROM ${table}`);

    return res.rows[0].count;
};

const processData = async (table, from = 0, limit = LIMIT) => {
    const data = await getDataFromTable(table, from, limit);
    await db.collection(table).insertMany(data);
    return data.length;
};

const main = async () => {
    await init();

    const tables = await getAllTables();

    for (let table of tables) {
        const total = await getTotalCount(table);
        for (let done = 0; done < total; ) {
            const processed = await processData(table, done, LIMIT);
            done += processed;
            console.log(
                `Import Done = ${table}, ${done}/${total} : ${(
                    (done * 100) /
                    total
                ).toFixed(2)}%`
            );
        }
    }

    await close();
};
main();

const pgp = require('pg-promise')();
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'newsscraper',
    max: 30 // use up to 30 connections
};
const db = pgp(cn);


module.exports = db
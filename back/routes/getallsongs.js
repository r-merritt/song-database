var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET all songs listing. */
router.get('/', async function(req, res, next) {
        console.log("Get all songs");

        const client = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'otptunes',
        })

        await client.connect();

        const query = await client.query('SELECT * FROM songs');

        await client.end();

        res.contentType = 'application/json';
        res.send(query);
    });

module.exports = router;

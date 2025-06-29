var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET artist by id listing. */
router.get('/', async function(req, res, next) {
        console.log("Get artist by id");

        if (!req.query.id) {
            return;
        }

        console.log(req.query.id);

        const client = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'otptunes',
        })

        const values = [
            req.query.id,
        ];

        var text = 'SELECT * FROM artists WHERE artist_id = $1;';

        const query = {
            text: text,
            values: values,
        };

        console.log(query);

        await client.connect();

        var answer;
        try {
            answer = await client.query(query);
        } catch (err) {
            console.log(err);
        }

        await client.end();

        res.contentType = 'application/json';
        res.send(answer);

        // res.send('ok!');
    });

module.exports = router;

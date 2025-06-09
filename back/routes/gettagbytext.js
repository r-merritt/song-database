var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();

/* GET get tag by text listing. */
router.get('/', async function(req, res, next) {
        console.log("Get tag by text");

        if (!req.query.tag) {
            return;
        }

        console.log(req.query.tag);

        const client = new Client({
        user: 'postgres',
        password: 'admin',
        host: 'localhost',
        port: 5432,
        database: 'otptunes',
        })

        const values = [
            req.query.tag,
        ];

        var text = 'SELECT * FROM tags WHERE UPPER(tag_text) = UPPER($1)';

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

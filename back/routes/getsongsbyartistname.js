var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var DBClientCreds = require('../DBClientCreds');

/* GET songs by artist name listing. */
router.get('/', async function(req, res, next) {
        console.log("Get songs by artist name");

        if (!req.query.name) {
            return;
        }

        console.log(req.query.name);

        const client = new Client(DBClientCreds);

        function prepareQuery(queryText) {
            return '%' + queryText.split(' ').join('%') + '%';
        }

        const values = [
            prepareQuery(req.query.name),
        ];

        if (req.query.limit) {
            values.push(req.query.limit);
        } else {
            values.push(5);
        }

        var text = 'SELECT artist_id, artist_text, display_title FROM (SELECT * FROM artists WHERE artist_text ILIKE $1) artists \n' +
                   'JOIN LATERAL (SELECT * FROM songs WHERE songs.display_artist = artists.artist_id LIMIT $2) songs \n' +
                   'ON songs.display_artist = artists.artist_id;';

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
            answer = {code: err.code};
            res.status(418);
        }

        await client.end();

        res.contentType = 'application/json';
        res.send(answer);
    });

module.exports = router;

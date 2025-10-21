var pg = require('pg');
var Client = pg.Client;
var express = require('express');
var router = express.Router();
var DBClientCreds = require('../DBClientCreds');

/* POST add song listing. */
router.post('/', async function(req, res, next) {
        console.log("Add song");

        console.log(req.body.songTitle);

        // mutually exclusive:
        console.log(req.body.artistId);
        // OR
        console.log(req.body.newArtistText);
        //

        // mutually exclusive:
        console.log(req.body.albumId);
        // OR
        console.log(req.body.newAlbumTitle);
        console.log(req.body.newAlbumYear);
        //

        const client = new Client(DBClientCreds);

        await client.connect();

        var text = 'SELECT insert_new_song($1, $2, $3, $4, $5, $6)';

        const values = [
            req.body.songTitle,
            req.body.artistId,
            req.body.newArtistText,
            req.body.albumId,
            req.body.newAlbumTitle,
            req.body.newAlbumYear,
        ];

        const query = {
            text: text,
            values: values,
        };

        console.log(query);

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

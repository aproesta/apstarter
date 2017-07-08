"use strict";

const config = require('config');
const isJSON = require('is-json');
const fs = require('fs');
const decompress = require('decompress');
const formidable = require('formidable');
const path = require('path');
var os = require('os');


module.exports = function (app) {

    app.post('/apis/v1/passupload', function (request, response) {

        try {
            var form = new formidable.IncomingForm();
            form.parse(request, function (err, fields, files) {
                if (err)
                    throw err;

                var res = {};
                res.fields = fields;

                var dirPath = os.tmpdir() + path.sep;
                var dir = fs.mkdtempSync(dirPath);
                res.fileName = files.filetoupload.name;
                res.fileUploadDir = files.filetoupload.path;
                res.uncompressDir = dir;

                decompress(files.filetoupload.path, dir).then(filesed => {
                    res.files = filesed;
                    response.json(res);
                });
            });

        } catch (err) {
            console.error("EXCEPTION\n" + JSON.stringify(err));
            response.sendStatus(500);
        }
    });

    app.get('/apis/v1/pass', function (request, response) {

        try {
            // request.checkParams('team', 'Missing Team').notEmpty();

            request.getValidationResult().then(function (result) {
                if (!result.isEmpty()) {
                    console.error("Validation ERROR: " + JSON.stringify(result.array()));
                    response.sendStatus(400);
                } else {
                    var team = request.query.team;
                    if (!team) {
                        response.sendStatus(400);
                    } else {
                        response.json({ 'response': '2010' });
                    }
                }
            })
        } catch (err) {
            console.error("EXCEPTION\n" + JSON.stringify(err));
            response.sendStatus(500);
        }
    });

}
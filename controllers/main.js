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

                var doc = {};
                doc.fields = fields;

                // TODO validate we have a custid in fields
                // TODO validate we have a pkpass file

                var dirPath = os.tmpdir() + path.sep;
                var dir = fs.mkdtempSync(dirPath);
                doc.fileName = files.filetoupload.name;
                doc.fileUploadDir = files.filetoupload.path;
                doc.uncompressDir = dir;

                decompress(files.filetoupload.path, dir).then(filesed => {
                    doc.files = filesed;

                    app.locals.db.insert(doc, '', function (err, newDoc) {
                        if (err) {
                            console.log(err);
                            response.sendStatus(500);
                        } else {
                            response.json({'id': newDoc.id});
                        }
                    });
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
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

                var validRequest = true;
                var dirPath = os.tmpdir() + path.sep;
                var dir = fs.mkdtempSync(dirPath);
                var doc = {
                    fileName: files.filetoupload.name,
                    fileUploadDir: files.filetoupload.path,
                    uncompressDir: dir,
                    fields: fields
                };

                // check for custid in payload
                if (!doc.fields || !doc.fields.custid) {
                    validRequest = false;
                }

                // check for pkpass extension
                if (validRequest && !doc.fileName.endsWith('.pkpass')) {
                    validRequest = false;
                }

                if (validRequest) {
                    decompress(files.filetoupload.path, dir).then(filesed => {
                        doc.files = filesed;
                        if (doc.files) {
                            // look for the pass.json file
                            for (var i = 0; i < doc.files.length; i++) {
                                if (doc.files[i].path === "pass.json") {
                                    doc.pass = JSON.parse(doc.files[i].data.toString());
                                }
                                if (doc.files[i].path === "manifest.json") {
                                    doc.manifest = JSON.parse(doc.files[i].data.toString());
                                }
                                if (doc.files[i].path === "signature") {
                                    doc.signature = true;
                                }
                            }
                        }

                        validRequest = doc.pass && doc.manifest && doc.signature;
                        if (validRequest) {
                            app.locals.db.insert(doc, '', function (err, newDoc) {
                                if (err) {
                                    console.log(err);
                                    response.sendStatus(500);
                                } else {
                                    if (process.env.NODE_ENV === 'test')
                                        response.json(newDoc);
                                    else
                                        response.json({ 'id': newDoc.id });
                                }
                            });
                        }
                        if (!validRequest) {
                            response.sendStatus(400);
                        }
                    });
                }
                if (!validRequest) {
                    response.sendStatus(400);
                }
            });
        } catch (err) {
            console.error("EXCEPTION\n" + JSON.stringify(err));
            response.sendStatus(500);
        }
    });

    app.get('/apis/v1/pass/:passId', function (request, response) {

        try {
            var id = request.params.passId;
            if (!id) {
                response.sendStatus(400);
            } else {
                app.locals.db.get(id, {}, function (err, doc) {
                    if (err)
                        response.sendStatus(404);
                    else
                        response.json(doc);
                });
            }
        } catch (err) {
            console.error("EXCEPTION\n" + JSON.stringify(err));
            response.sendStatus(500);
        }
    });

    app.delete('/apis/v1/pass/:passId', function (request, response) {

        try {
            var id = request.params.passId;
            var revId = request.query.rev;
            if (!id || !revId) {
                response.sendStatus(400);
            } else {
                app.locals.db.destroy(id, revId, function (err, doc) {
                    if (err)
                        response.sendStatus(404);
                    else
                        response.sendStatus(200);
                });
            }
        } catch (err) {
            console.error("EXCEPTION\n" + JSON.stringify(err));
            response.sendStatus(500);
        }
    });

}
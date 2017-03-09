"use strict";


var config = require('config');
var isJSON = require('is-json');

module.exports = function (app) {

    app.get('/apis/v1/main', function (request, response) {

        var clientSecret = request.get("CLIENT-SECRET");

        try {
            if (clientSecret && clientSecret === config.get('clientSecret')) {

                // request.checkBody('firstName', 'Invalid firstName').notEmpty();
                // request.checkBody('lastName', 'Invalid lastName').notEmpty();


                request.getValidationResult().then(function (result) {
                    if (!result.isEmpty()) {
                        console.error("Validation ERROR: " + JSON.stringify(result.array()));
                        response.sendStatus(400);
                    } else {

                        var reqData = request.body;
                        if (isJSON.strict(reqData)) {
                            response.json({ "response": "response" });
                        } else {
                            console.error("JSON EXCEPTION\n" + body);
                            response.sendStatus(500);
                        }
                    }
                })
            }
            else {
                response.sendStatus(403);
            }
        } catch (err) {
            console.error("EXCEPTION\n" + JSON.stringify(err));
            response.sendStatus(500);
        }
    });

}
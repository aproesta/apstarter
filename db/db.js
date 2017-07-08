

function getDBCredentialsUrl(services) {
    var vcapServices = JSON.parse(services);
    for (var vcapService in vcapServices) {
        if (vcapService.match(/cloudantNoSQLDB/i)) {
            return vcapServices[vcapService][0].credentials.url;
        }
    }
}

module.exports.initDB = function initDBConnection(app, dbName) {
    var url;
    if (process.env.VCAP_SERVICES) {
        url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else {
        const localConfig = require("./vcap-local.json");
        url = getDBCredentialsUrl(JSON.stringify(localConfig));
    }

    cloudant = require('cloudant')(url);

    // check if DB exists if not create
    cloudant.db.create(dbName, function(err, res) {
        if (err && err.statusCode != 412) {
            console.error('Could not create new db: ' + dbName + ' \n' + JSON.stringify(err));
        }
    });

    app.locals.db = cloudant.use(dbName);
}
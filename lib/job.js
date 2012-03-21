var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require("path"),
    wrench = require("wrench"),
    zip = require("zip"),

    _workspace = path.normalize(__dirname + "/../workspace");

function prepare(job, callback) {
    // TODO: Do a CLEAN/Delete workspace first
    if (!path.existsSync(_workspace)) {
        fs.mkdirSync(_workspace, "0755");
    }

    downloadDependency(job, callback);
    // grab functional tests
}

function downloadDependency(job, callback) {
    var DEP_URL = "http://10.137.42.46:9000/job/" + job + "/ws/target/zip/*zip*/zip.zip",
        DEP_LOCATION = _workspace + "/zip.zip",
        req;

    if (!path.existsSync(DEP_LOCATION)) {
        console.log("STEP: download zip")
        _url = url.parse(DEP_URL);
        
        req = http.get({'host': '10.137.42.46', 'port': '9000', 'path': _url.pathname}, function (res) {
            var stream = fs.createWriteStream(DEP_LOCATION);
            res.pipe(stream);
            res.on('end', function () {
                callback();
            });
        }).on('error', function (e) {
            throw (new Error("Unable to Download Dependency: " + e.message));
        });

        req.on('error', function (e) {
            throw (new Error('Problem with request: ' + e.message));
        });
    } else {
        console.log("STEP: skip download of zip")
        callback();
    }
}

function createPage() {
    // just copy tests to public/spec folder...
}

function package(cb) {
    // bbwp
}

function deploy() {
    // deploy -installApp -launchApp

    // check console output for percentage
    // callback 
}

_self = {
    run: function (job) {
        console.log(_workspace);

        prepare(job, function () {
            console.log("downloaded");
        });
    }
};

module.exports = _self;
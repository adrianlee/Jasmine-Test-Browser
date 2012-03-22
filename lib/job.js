var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require("path"),
    wrench = require("wrench"),
    zip = require("zip"),
    _workspace = path.normalize(__dirname + "/../workspace");

function prepare(job, callback) {
    var PACKAGER_URL = "http://mac-ci:9000/job/" + job + "/ws/target/zip/*zip*/zip.zip",
        FUNCTIONAL_TEST_URL = "http://mac-ci:9000/job/" + job + "/ws/Framework/ext/test.functional/*zip*/test.functional.zip",
        PACKAGER_FILENAME = "/zip.zip",
        FUNCTIONAL_TEST_FILENAME = "/test.functional.zip";
    
    // TODO: Do a CLEAN/Delete workspace first
    if (!path.existsSync(_workspace)) {
        fs.mkdirSync(_workspace, "0755");
    } else 

    downloadDependency(PACKAGER_URL, PACKAGER_FILENAME, function (err) {
        if (err) {
            callback(err);
        } else {
            unzipDependency(PACKAGER_FILENAME, function (err) {
                if (err) { 
                    callback(err);
                } else {
                    fs.unlinkSync(_workspace + PACKAGER_FILENAME);
                    callback();
                }
            });
        }
    });

    // grab functional tests from framework/ext/test.functional and place in workpace/public/spec
    // http://mac-ci:9000/job/BB10-Webworks-Packager-next-api-refactor/ws/Framework/ext/test.functional/*zip*/test.functional.zip
    downloadDependency(FUNCTIONAL_TEST_URL, FUNCTIONAL_TEST_FILENAME, function (err) {
        if (err) {
            callback(err);
        } else {
            unzipDependency(FUNCTIONAL_TEST_FILENAME, function (err) {
                if (err) { 
                    callback(err);
                } else {
                    fs.unlinkSync(_workspace + FUNCTIONAL_TEST_FILENAME);
                    callback();
                }
            });
        }
    });
}

function downloadDependency(source, destination, callback) {
    var _url = url.parse(source),
        _destination = _workspace + destination,
        req;

    if (!path.existsSync(_destination)) {
        console.log("STEP: download zip")

        // TODO: check HTTP response status code for 
        
        req = http.get({'host': 'mac-ci', 'port': '9000', 'path': _url.pathname}, function (res) {
            if (res.statusCode !== 200) {
                callback("downloadDependency http request: " + res.statusCode);
            } else {
                var stream = fs.createWriteStream(_destination);
                res.pipe(stream);
                res.on('end', function () {
                    callback();
                });
            }
        }).on('error', function (e) {
            throw (new Error("downloadDependency - Unable to Download Dependency: " + e.message));
        });

        req.on('error', function (e) {
            throw (new Error('downloadDependency - Problem with request: ' + e.message));
        });
    } else {
        console.log("STEP: skip download of zip")
        callback();
    }
}

function unzipDependency(target, callback) {
    var data, 
        filesObj, 
        p, 
        parent, 
        to = _workspace;
    
    if (!path.existsSync(_workspace + target)) {
        // throw (new Error(".zip is missing ..."));
        callback('.zip is missing ...');
    }

    data = fs.readFileSync(_workspace + target);
    filesObj = zip.Reader(data).toObject();

    if (!path.existsSync(to)) {
        wrench.mkdirSyncRecursive(to, "0755");
    }

    for (p in filesObj) {
        if (p.split("/").length > 1) {
            parent = p.split("/").slice(0, -1).join("/");
            wrench.mkdirSyncRecursive(to + "/" + parent, "0755");
        }

        fs.writeFileSync(to + "/" + p, filesObj[p]);
    }
    callback();
}

function createPage() {
    // just copy tests to public/spec folder...
}

function package(callback) {
    // bbwp
    callback();
}

function deploy() {
    // deploy -installApp -launchApp

    // check console output for percentage
    // callback 
}

_self = {
    run: function (job, callback) {
        console.log(_workspace);

        prepare(job, function (err) {
            if (err) {
                callback(err);
            } else {
                package(function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                });
            }
        });
    }
};

module.exports = _self;
var http = require('http'),
    express = require('express'),
    app = express.createServer(),
    job = require('./lib/job');
  
app.configure(function() {
    app.use(express.bodyParser())
    app.use(express.static(__dirname + '/workspace/public'))
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true}))
});

app.get('/', function(req, res) {
    // res.sendfile(__dirname + '/public/index.html');
    res.send("GET: /run/:job<br>GET: /run");
});

app.get('/run', function(req, res) {
    // generate index html file and inject the jasmine specs into <head>
    res.sendfile(__dirname + '/workspace/public/index.html');
});

app.get('/run/:job', function(req, res) {
    job.run(req.params.job);
    res.send(req.params.job);
});

app.listen(3000);
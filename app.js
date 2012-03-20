var express = require('express'),
	app = express.createServer();
  
app.configure(function(){
	app.use(express.bodyParser())
	app.use(express.static(__dirname + '/public'))
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true}))
});

app.get('/', function(req, res){
	res.sendfile(__dirname + '/public/index.html');
});

app.listen(3000);
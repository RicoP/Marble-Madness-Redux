var http = require('http'), fs = require("fs"), path = require("path"), urlParser = require("url").parse, handlerList = syncDir("http");

http.createServer(function(req, res) {
	var parsedUrl = urlParser(req.url, true);
	handler = handlerList[parsedUrl.pathname];

	if(!handler) {
		redirect404(req, res);
		return;
	}

	handler(req, res);
}).listen(8004, "127.0.0.1");

process.title = "node MMR";
console.log(new Date().toString() + " MMR gestarted.");

function redirect404(req, res) {
	res.writeHead(404, {});
	res.end("404: " + req.url + " Not found. " + new Date());
}

function syncDir(dir) {
	var handler = {}, file = null, i = 0, files = fs.readdirSync(dir);

	for(var i = 0; i != files.length; i++) {
		file = files[i];
		if(file)
			(function(f) {
				var stat = fs.statSync(f), base = path.basename(f);

				if(stat.isFile())
					handler["/" + base] = createFileHandler(f);
			})(dir + "/" + file);
	}

	handler["/"] = handler["/index.html"];

	return handler;
}

function createFileHandler(file) {
	return function(req, res) {
		readLocalFile(req, res, file);
	};
}

function readLocalFile(req, res, file) {
	console.log(req.url + "-->" + file);
	fs.readFile(file, function(err, data) {
		res.writeHead(200, {
			'Content-Type' : 'text/html'
		});
		if(err) {
			res.write(JSON.stringify(err));
		} else {
			res.write(data);
		}
		res.end("");
	});
}
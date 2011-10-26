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

	handler["/"] = createIndexHandler(files);

	return handler;
}

function createFileHandler(file) {
	return function(req, res) {
		readLocalFile(req, res, file);
	};
}

/**
 *
 * Erzeugt den Filehandler für den Index
 *
 * @param files {array} die Dateien im Ordnerbaum
 *
 * */
function createIndexHandler(files) {
	var orderedFiles = files.slice(0), //copy files
	s = "";
	orderedFiles.sort();
	s += ("<html><head><title>Possienka.de</title></head><body>");
	s += ("<ul>");

	for(var i = 0; i != orderedFiles.length; i++) {
		s += ("<li><a href='LINK'>LINK</a></li>".replace(/LINK/g, orderedFiles[i]));
	}
	s += ("</ul>");
	s += ("</body></html>");

	return function(req, res) {
		res.writeHead(200, {
			'Content-Type' : 'text/html'
		});

		res.end(s);
	};
}

/**
 * Liest eine Datei, relativ zum Pfad und schreibt den Inhalt in die Response.
 *
 * @param req {ServerRequest} der Request
 * @param res {ServerResponse} die Response
 * @param file {String} der Pfad zu einer Datei
 */
function readLocalFile(req, res, file) {
	console.log(req.url + "-->" + file);
	fs.readFile(file, function(err, data) {
		res.writeHead(200, {
			'Content-Type' : getMimeType(file)
		});
		if(err) {
			res.write(JSON.stringify(err));
		} else {
			res.write(data);
		}
		res.end("");
	});
}

/**
 * Gibt den Mime-Type zur entsprechenden Dateiendung zurück
 *
 * @param {String} der Dateiname
 */
function getMimeType(file) {
	var split, suffix, list, mime;
	split = file.split(/\./g);
	suffix = split.pop();
	list = {
		"txt" : "text.plain",
		"html" : "text/html",
		"htm" : "text/html",
		"json" : "application/json",
		"js" : "application/javascript",
		"ico" : "image/x-icon",
		"png" : "image/png",
		"jpg" : "image/jpeg"
	};

	if(split.length !== 0 && suffix !== "") {
		mime = list[suffix]
		if(mime) {
			console.log("Mimetype für " + file + " = " + mime);
			return mime;
		}
	}

	console.log("Can't find a MIME type for file " + file + ".");
	return "text/plain";
}
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const hostname = "127.0.0.1"; // idk
const port = process.env.PORT || 5000;

var workingDir = path.dirname(__filename);
var homePage = workingDir + "/client/html/index.html";

function flipify(url) {
	return url.replace(/\\/g, "/");
}

function fetchResource(req, res) {
	// See if url even leads to a page
	if (req.url == "/") {
		fs.readFile(homePage, function(err, data) { res.end(data); });
		console.warn("[WARN] The url didnt lead to a page, redirecting to homepage req.url=", req.url);
		return false;
	}
	
	// See if url can be cleaned
	var requestUrl
	if (path.extname(req.url) == ".html") { 
		requestUrl = flipify(workingDir + "/client/html" + req.url); // Translate "clean" url for .html files
	} else if (path.extname(req.url) != ".html") { 
		requestUrl = flipify(workingDir + req.url); console.log("req clean url"); // Translate "full" url for any other resource
	}

	// Fetch the resource
	fs.readFile(requestUrl, function(err, data) {
		if (err == null) { 
			res.end(data); 
			console.log("[SUCCESS]: requested", requestUrl);
		}
		if (err != null) { 
			res.end("Page not found.");
			console.error("[FAIL]: requested", requestUrl);
		}
	});
	
	return true;
}

// Server setup
const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html");
	fetchResource(req, res);
}).listen(port, () => {
	console.log(`Server running at port ${port}/`);
	console.log("Working dir: ", workingDir);
	console.log("Homepage: ", homePage)
});
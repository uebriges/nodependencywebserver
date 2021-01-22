// Nodependency web server
const http = require('http');
const url = require('url');
const fs = require('fs');

// Returns the HTML content type based on the file extension
function getContentType(ext) {
  const mimeTypes = {
    html: 'text/html',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    json: 'application/json',
    js: 'text/javascript',
    css: 'text/css',
  };
  return mimeTypes[ext];
}

// Sends HTML response
function sendResponse(res, path, requestedResourceExists) {
  if (requestedResourceExists) {
    const content = fs.readFileSync(path).toString(); // Not possible for images -> propably an encoding problem
    res.writeHead(200, {
      'Content-Type': getContentType(path.slice(path.lastIndexOf('.') + 1)),
    });
    res.end(JSON.stringify(content));
  } else {
    console.log('else');
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end();
  }
}

/*
  Checks if requested resource is available
  If request contains path without file name and extension, index.html is looked up. Otherwise 404!
*/
const handlerFunction = function (req, res) {
  let call = new URL(req.url, 'http://localhost/');
  let path = '.'.concat(call.pathname);
  console.log(call.pathname);

  // If existing directory was requested
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    path += 'index.html';
    if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
      sendResponse(res, path, true);
    } else {
      sendResponse(res, '', false);
    }
  } else if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
    sendResponse(res, path, true);
  } else {
    sendResponse(res, '', false);
  }
};

const server = http.createServer(handlerFunction);
server.listen(3000, 'localhost');

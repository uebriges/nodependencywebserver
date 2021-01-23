// Nodependency web server
const http = require('http');
const fs = require('fs');

// Returns the HTML content type based on the file extension
function getContentType(ext) {
  const mimeTypes = {
    html: 'text/html;charset=UTF-8',
    jpeg: 'image/jpeg;charset=UTF-8',
    jpg: 'image/jpeg;charset=UTF-8',
    png: 'image/png;charset=UTF-8',
    svg: 'image/svg+xml;charset=UTF-8',
    json: 'application/json;charset=UTF-8',
    js: 'text/javascript;charset=UTF-8',
    css: 'text/css;charset=UTF-8',
  };
  return mimeTypes[ext];
}

// Sends HTML response
function sendResponse(res, path, requestedResourceExists) {
  if (requestedResourceExists) {
    fs.readFile(path.toString(), (err, data) => {
      if (err) throw err;
      res.writeHead(200, {
        'Content-Type': getContentType(path.slice(path.lastIndexOf('.') + 1)),
      });
      res.write(data);
      res.end();
    }); // Not possible for images -> probably an encoding problem

    console.log(`HTTP 200 -->  ${path}`);
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
  const call = new URL(req.url, 'http://localhost/');
  let path = './public'.concat(call.pathname);

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

const port = 3000;
const server = http.createServer(handlerFunction);
server.listen(port, 'localhost');
console.log(`Server is listening on port ${port}`);

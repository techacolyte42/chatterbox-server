/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {

  // console.log(request.statusCode);

  var statusCode = 404;

  if(request.url !== '/classes/messages') {
    statusCode = 404;
  } else {
    if (request.method === 'GET') {
      statusCode = 200;
    } else if (request.method === 'POST') {
      statusCode = 201;
    } 
  }


  var information = '';
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';


  request.on('error', (error) => {
    console.log(error);
  }).on('data', (chunk) => {
    information += chunk;
    console.log('This is what information is', information);
    console.log('This is the method', request.method)
  }).on('end', () => {
    // console.log('This is the end of the request');
  });
  
  // console.log('Serving request type ' + request.method + ' for url ' + request.url);


  var responseBody = {
    headers: headers,
    url: request.url,
    method: request.method,
    body: information
  };

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);






  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end(JSON.stringify(responseBody));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

module.exports = requestHandler;
 

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


var defaultCorsHeaders = {
  'access-control-request-method': '*',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = {};
messages.results = [{
      username: 'Jono',
      message: 'Do my bidding!'
    }];
var headers = defaultCorsHeaders;
headers['Content-Type'] = 'application/json';

var requestHandler = function(request, response) {

  var message = '';

  if (!request.url.includes('/classes/messages')) {
    response.writeHead(404, headers);
    response.end();
  } else if (request !== undefined) {
    if (request.method === 'GET') {
      response.writeHead(200, headers);

      request.on('error', (error) => {
        console.log(error);
      });
      request.on('data', (chunk) => { 
        message += chunk;
      });
      request.on('end', () => {
        var responseBody = {
          // headers: headers,
          // url: request.url,
          // method: request.method,
          results: messages.results
        };
        response.end(JSON.stringify(responseBody));
      });
    } else if (request.method === 'POST') {
      response.writeHead(201, headers);

      request.on('error', (error) => {
        console.log(error);
      });
      request.on('data', (chunk) => {
        message += chunk;
      });
      request.on('end', () => {
        messages.results.push(JSON.parse(message));
        response.end();
      });
    }
    else if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();
    }
  }




  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  






  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
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


module.exports.requestHandler = requestHandler;


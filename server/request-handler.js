var defaultCorsHeaders = {
  'access-control-request-method': '*',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


var messages = [{'roomname': 'lobby', username: 'Jono', message: 'Do my bidding!'}];

var headers = defaultCorsHeaders;
headers['Content-Type'] = 'application/json';

var requestHandler = function(request, response) {

  var message = '';

  if (!request.url.includes('/classes')) {
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
          results: messages
        };
        response.end(JSON.stringify(responseBody));
      });



    } else if (request.method === 'POST') {
      //response.writeHead(204, headers);

      request.on('error', (error) => {
        console.log(error);
      });
      request.on('data', (chunk) => {
        message += chunk;
      });
      request.on('end', () => {
        var parsed = JSON.parse(message);
        if (!(parsed.username)) {
          parsed.username = 'Anonymous';
        }

        if (parsed.message) {
          messages.push(parsed);
        }

        if (parsed.message === 'I am a teapot') {
          response.writeHead(418, headers);
          response.end('I am a teapot');
        } else {
          response.writeHead(204, headers);
          response.end();
        }

      });
    } else if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end();
    } else if (request.method === 'DELETE') {
      response.writeHead(418, headers);
      response.end('I am a teapot');
    }
  }

};



module.exports.requestHandler = requestHandler;


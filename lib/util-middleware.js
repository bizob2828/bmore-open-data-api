'use strict';
// Provide a respond method that will intercept an empty response and serialize the response format
module.exports.response = function(req, res, next) {
  res.respond = function(body, code) {
    code = code || 200;
    body = {results: body};
    res.header('Content-Type', 'application/json');
    res.status(code).send(JSON.stringify(body));
  };

  next();
};


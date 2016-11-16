'use strict';
// Provide a respond method that will intercept an empty response and serialize the response format
module.exports.response = (req, res, next) => {
  res.respond = function(body, code, links) {
    code = code || 200;
    body = {results: body};
    if (links) {
      body.links = links;
    }
    res.header('Content-Type', 'application/json');
    res.status(code).send(JSON.stringify(body));
  };

  next();
};

module.exports.formattedError = (req, res, next) => {
  res.error = (err, msg, code) => {
    let errorBody = msg || err.message
      , errCode = code || 500;

    res.header('Content-Type', 'application/json');
    res.status(errCode).send(JSON.stringify({ errors: errorBody }));
  };

  next();

};

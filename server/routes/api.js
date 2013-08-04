var request = require('request')
     config = require('config');

var c = config.couch,
    m = config.meta;

var couchURL = 'http://' + c.url + ':' + c.port + '/' + c.db;

module.exports = function (app) {
  app.get('/api', getAPI);
  app.get('/meta', getMeta);
};

function getAPI(req, res, next) {
  var url = couchURL + '/_all_docs?include_docs=true';

  request({
    url: url,
    headers: { 'content-type': 'application/json' }
  }, function (err, resp, body) {
    if (err) {
      if (resp) {
        res.writeHead(resp.statusCode);
        res.end(body);
      } else { // This would happen if the request timed out
        res.writeHead(408);
        res.end('timeout');
      }
    }
  }).pipe(res);
}

function getMeta(req, res, next) {
  res.send({
    name: m.name,
    version: m.version,
    baseURL: m.url
  });
}

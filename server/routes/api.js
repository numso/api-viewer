var      fs = require('fs'),
    request = require('request'),
     config = require('config'),
          _ = require('underscore');

var c = config.couch;
var m = config.meta;
var f = config.file;

module.exports = function (app) {
  app.get('/couch/api', getAPIfromCouch);
  app.get('/file/api', getAPIfromFile);
  app.get('/meta', getMeta);
};

function getAPIfromFile(req, res, next) {
  var fileAPI = fs.readFileSync(f.path, 'utf-8');
  res.send(fileAPI);
}

function getAPIfromCouch(req, res, next) {
  var couchURL = 'http://' + c.url + ':' + c.port + '/' + c.db;
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
    else {
      body = JSON.parse(body);

      var json = _.map(body.rows, function (data) {
        delete data.doc._id;
        delete data.doc._rev;
        return data.doc;
      });

      res.send(json);
    }
  });
}

function getMeta(req, res, next) {
  res.send({
    name: m.name,
    version: m.version,
    baseURL: m.url
  });
}

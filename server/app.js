var     http = require('http'),
          fs = require('fs'),
     express = require('express'),
      stylus = require('stylus');

var app = express();

app.configure(function () {
  app.set('port', process.env.VCAP_APP_PORT || process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(app.router);
  app.use(stylus.middleware({
    debug: true,
    src: 'client',
    dest: 'client'
  }));
  app.use(express.static('client'));
  app.use(express.errorHandler());
});

fs.readdirSync(__dirname + '/routes').forEach(
  function (file) {
    require('./routes/' + file)(app);
  }
);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

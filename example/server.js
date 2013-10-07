var express = require('express'),
  Coinbase = require('../index.js').Coinbase,
  Credentials = Coinbase.Credentials,
  config = require('./config.json'),
  port = process.env['PORT'] || 4000,
  api,
  app = express();

app.use(express.cookieParser());
app.use(express.bodyParser());
api = new Coinbase(config);

app.get('/', function(req, res){
  res.redirect(api.getAuthorizeUrl());
});

app.get('/callback', function(req, res){
  console.log(req.query);
  api.getAccessToken(req.query['code'], {}, function (err, credentials){
    // Don't really store these in a cookie on production.
    // This would normally be encrypted and stored in
    // a seperate server side data-store
    res.cookie('cb_auth', credentials.toJSON());
    res.send(credentials.toJSON());
  });
});

app.get('/api/:type/:action', function(req, res){
  var credentials = new Credentials(req.cookies.cb_auth),
    consumer = api.createConsumer(credentials);
  consumer.get('/api/v1/'+req.params['type']+'/'+req.params['action'], function (err, resp) {
    console.log(err, resp);
    res.send(resp);
  });

});

app.get('/api/request', function(req, res){
  var credentials = new Credentials(req.cookies.cb_auth),
    consumer = api.createConsumer(credentials),
    body = {
      "transaction": {
        "from": "m@mdp.im",
        "amount": "0.05",
        "notes": "Give me money"
      }
    };
  consumer.post('/api/v1/transactions/request_money', body, function (err, resp) {
    console.log(err, resp);
    res.send(resp);
  });
});

app.listen(port, function () {
  console.log('Listening on at port ' + port);
});

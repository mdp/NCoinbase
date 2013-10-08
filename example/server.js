var express = require('express'),
  Coinbase = require('../index.js').Coinbase,
  Credentials = Coinbase.Credentials,
  config = require('./config.json'),
  port = process.env['PORT'] || 4000,
  api,
  app = express();

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
api = new Coinbase(config);


// This is just an example app.
// In production, don't store a users
// coinbase credentials in a cookie.
// Ideally you should use a server side
// data store, with some type of encryption.

app.use(function (req, res, next) {
  var credentials, consumer;
  if (req.session.cbAuth) {
    credentials = new Credentials(req.session.cbAuth);
    consumer = api.createConsumer(credentials);
    req.coinbase = consumer;
    consumer.on('updatedCredentials', function (newCreds) {
      console.log('Credentials had expired and were updated successfully')
      req.session.cbAuth = newCreds.toJSON();
    });
    next();
  } else if (req.query.code){
    // Let it go to the callback
    next();
  } else {
    res.redirect(api.getAuthorizeUrl());
  }
});

app.get('/callback', function(req, res){
  api.getAccessToken(req.query['code'], {}, function (err, credentials){
    console.log(credentials);
    req.session.cbAuth = credentials.toJSON();
    res.redirect("/");
  });
});

app.get('/', function(req, res){
  req.coinbase.user_list()
    .then(function (resp) {
      console.log("Resp", resp);
      res.send(resp);
    })
    .catch(function (err) {
      console.log("Err", err);
      res.send("API Request failed: " + err.message);
    });
});

app.get('/my_balance', function(req, res){
  req.coinbase.account_balance(function (err, resp) {
    console.log(err, resp);
    if (err) {
      res.send(err);
      return false
    }
    res.send(resp);
  });
});

app.get('/addresses', function(req, res){
  req.coinbase.addresses()
    .then(function (resp) {
      console.log("Resp", resp);
      res.send(resp);
    })
    .catch(function (err) {
      console.log("Err", err);
      res.send("API Request failed: " + err.message);
    });
});

app.get('/request_money_from/:email', function(req, res){
  var body = {
      "transaction": {
        "from": req.params.email,
        "amount": "0.05",
        "notes": "Give me money"
      }
    };
  req.coinbase.post('transactions/request_money', body, function (err, resp) {
    console.log(err, resp);
    res.send(resp);
  });
});

app.listen(port, function () {
  console.log('Listening on at port ' + port);
});

# NCoinbase
An OAuth2 compliant NodeJS Coinbase API library

[![Build Status](https://secure.travis-ci.org/mdp/NCoinbase.png)](http://travis-ci.org/mdp/NCoinbase)

## Quick Overview

- Implements all the v1 API methods
- Every API method allows callbacks or returns promises
- Automatically refreshes expired tokens (and fires an event)

## Installation

    npm install ncoinbase

## Usage

### Setting up the client

    var Coinbase = require('ncoinbase').Coinbase,
        api = new Coinbase({
          "id": "api_id",
          "secret": "api_secret",
          "redirect_uri": "http://localhost:4000/callback",
          "scope": "balance request"
        });

### Creating and API consumer (user)

    // Assuming we pulled the users credentials
    // from the database and assigned them to 'user'
    credentials = new Credentials(user);
    consumer = api.createConsumer(credentials);

### Accessing the API

    req.coinbase.account_balance(function (err, resp) {
      console.log("My Account balance is: " + resp.amount );
    });

#### Using Promises

    req.coinbase.account_balance()
      .then(function (resp) {
        console.log("Resp", resp);
        res.send(resp);
      })
      .catch(function (err) {
        console.log("Err", err);
        res.send("API Request failed: " + err.message);
      });

#### Refreshing expired tokens

Expired tokens will be automatically refreshed when you attempt an API call.
You can, and should, listen for this for the 'updatedCredentials' event and
save the new credentials.

    consumer.on('updatedCredentials', function (credentials) {
      user.credentials = credentials;
      user.save();
    });
    // Let's assume the users credentials are expired
    // and we need to use the refresh token.
    consumer.account_balance(function (err, resp) {
      // This will still work, but before the 'account_balance'
      // request is made, the credentials will be refreshed,
      // and the 'updatedCredentials' event will be fired.
      console.log("I have " + resp.amount + " many bitcoins!!!");
    });

## Example web application

### Clone the repo and 'npm install'

    git clone https://github.com/mdp/NCoinbase.git
    cd NCoinbase
    npm install

    node example/server.js

### Authenticate with Coinbase

Now visit [http://localhost:4000](http://localhost:4000) to authenticate

### Exercise the API

After authenticating you should see your account details on the index page.
You can also try [http://localhost:4000/my_balance](http://localhost:4000/my_balance)
for your account balance.

### The nitty gritty

The example app show several library features

- Watching for expired/refreshed credentials and updating the session [example/server.js#L27](mdp/NCoinbase/blob/master/example/server.js#L27)
- Using promises with an error catch [example/server.js#L49](mdp/NCoinbase/blob/master/example/server.js#L49)
- Passing in a callback function [example/server.js#L61](mdp/NCoinbase/blob/master/example/server.js#L61)

## Testing

    git clone https://github.com/mdp/NCoinbase.git
    cd NCoinbase
    npm install
    npm test


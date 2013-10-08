# NCoinbase
An OAuth2 compliant NodeJS Coinbase API library

[![Build Status](https://secure.travis-ci.org/mdp/NCoinbase.png)](http://travis-ci.org/mdp/NCoinbase)

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



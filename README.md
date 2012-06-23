# Shurl

Node.js + Riak URL shortener.

## Features

 - URLs are just base-36 numbers
 - Supports additional query parameters (e.g. `/0001 -> www.google.com/search, /0001?q=foo -> www.google.com/search?q=foo`)
 - Ids can be reported. If an user access a reported URL, it will be presented with a warning (and the landing page title)

## Stack

 - Node.js
 - Express
 - Ejs
 - Riak
 - Riak-js
 - Twitter bootstrap

## Gotchas

 - There are bugs.
 - I used Riak secondary indexes, but the npm-available riak-js does not support them right now (as of 0.4.1).
 The `package.json` file dutily reports the dependencyo on the riak-js git HEAD version,
 but in order to run Shurl you will need to manually build it.
 
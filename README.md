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

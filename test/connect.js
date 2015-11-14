"use strict";

var MongoClient = require('mongodb').MongoClient
var Promise = require("bluebird");

// Connection URL
var url = 'mongodb://127.0.0.1:27017/index-explain';

module.exports = Promise.promisify(MongoClient.connect.bind(MongoClient, url));

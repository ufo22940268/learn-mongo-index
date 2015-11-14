/**
 * Created by cc on 11/14/15.
 */
"use strict";

var connect = require('./connect');
var Promise = require("bluebird");

/**
 * Generate random number between 0 to 100.
 */
function gen(i) {
  return i % 10;
}

function printExplain(result) {
  //var report = {};
  //var stats = result.executionStats;
  //report.totalDocsExamined = stats.totalDocsExamined;
  //report.totalKeysExamined = stats.totalKeysExamined;
  //report.winningPlan = result.queryPlanner.winningPlan;
  console.log("Explain result: ");
  console.log(JSON.stringify(result, null, 4))
}


describe('Insert data to db', function () {

  var school;

  before(function () {
    return connect()
      .then(function (newDb) {
        school = Promise.promisifyAll(newDb.collection('school'));
        return school.drop();
      })
      .catch(function () {
        //Ignore drop errors.
      })
      .then(function () {
        var docs = [];
        for (var i = 0; i < 100; i++) {
          var value = gen(i);
          docs.push({a: value, b: value, c: value, d: value});
        }
        return school.insertMany(docs);
      })
  });

  afterEach('clean indexes', function () {
    return school.dropIndexes();
  });

  describe('indexes {a: 1, b: 1}', function () {

    beforeEach(function () {
      return school.createIndex({a: 1, b: 1});
    });

    it("explain find({a: 3}).sort('b')", function () {
      console.log('Testing: ', this.test.title);
      return school.find({a: 3}).sort({b: 1}).explain()
        .then(function (result) {
          printExplain(result);
        })
    });
  });
  //
  describe('index {a: 1, b: 1, c: 1}', function () {

    beforeEach(function () {
      return school.createIndex({a: 1, b: 1, c: 1});
    });

    it("explain find({a: 3}).sort('c')", function () {
      console.log('Testing: ', this.test.title);
      return school.find({a: 3}).sort({c: 1}).explain()
        .then(function (result) {
          printExplain(result);
        })
    });

    it("explain find({a: 3, b: 3}).sort('c')", function () {
      console.log('Testing: ', this.test.title);
      return school.find({a: 3, b: 3}).sort({c: 1}).explain()
        .then(function (result) {
          printExplain(result);
        })
    });
  });

  describe('index {a: 1, b: 1, c: 1}', function () {

    beforeEach(function () {
      return Promise.all([school.createIndex({a: 1, b: 1}), school.createIndex({c: 1})]);
    });

    it("explain find({a: 3, b: 3}).sort('c') with two isolate indexes", function () {
      console.log('Testing: ', this.test.title);
      return school.find({a: 3, b: 3}).sort({c: 1}).explain()
        .then(function (result) {
          printExplain(result);
        })
    });
  });
});
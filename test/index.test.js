// Generated by CoffeeScript 1.10.0
(function() {
  var Url, expect, mocha, mongoose, request, sinon, url, www;

  mocha = require('mocha');

  sinon = require('sinon');

  expect = require('chai').expect;

  request = require('supertest');

  www = require('../bin/www');

  mongoose = require('mongoose');

  Url = require('../models/Url');

  url = 'http://localhost:3000';

  describe('/', function() {
    var cleanUrlCollection;
    cleanUrlCollection = function() {
      return db.collections.urls.drop();
    };
    before(function() {
      db.open('mongodb://localhost:27017/pitly');
      Url = db.model('Url', Url.schema);
    });
    after(function() {
      cleanUrlCollection();
      db.close(function() {
        return console.log('connection closed');
      });
    });
    beforeEach(function() {
      cleanUrlCollection();
    });
    return describe('GET /:shorten', function() {
      return it('should redirect to the correct URL', function(done) {
        populateDatabase().then(function(last) {
          var givenShorten;
          console.log('db populated');
          givenShorten = last.shorten;
          request(url).get("/" + givenShorten).expect(302).end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.header.location).to.equal(last.url);
            done();
          });
        });
      });
    });
  });

}).call(this);

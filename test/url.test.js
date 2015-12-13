// Generated by CoffeeScript 1.10.0
(function() {
  var Url, chai, expect, mocha, mongoose, sinon;

  mocha = require('mocha');

  sinon = require('sinon');

  chai = require('chai');

  expect = chai.expect;

  mongoose = require('mongoose');

  Url = require('../models/Url');

  if (!mongoose.connection) {
    mongoose.connect('mongodb://localhost:27017/pitly');
  }

  describe('Url', function() {
    var cleanUrlCollection, populateDatabase;
    cleanUrlCollection = function() {
      return mongoose.connection.collections.urls.drop();
    };
    after(function() {
      cleanUrlCollection();
      mongoose.connection.close();
      console.log('connection closed');
    });
    beforeEach(function() {
      cleanUrlCollection();
    });
    populateDatabase = function() {
      var url1, url2;
      url1 = new Url({
        url: "http://www.my-brand-new-url.com",
        shorten: "12345"
      });
      url2 = new Url({
        url: "http://www.another-url.com",
        shorten: "15625"
      });
      return url1.save().then(function() {
        return url2.save();
      });
    };
    describe('#findAll', function() {
      return it('should return all added urls', function(done) {
        populateDatabase().then(function() {
          Url.findAll().then(function(all) {
            expect(all.length).to.be.equal(2);
            expect(all[1]).to.have.property('url');
            expect(all[1]).to.have.property('shorten');
            done();
          });
        });
      });
    });
    describe('#findByUrl', function() {
      it('should return a url from it\'s url', function(done) {
        var id;
        id = "";
        populateDatabase().then(function(last) {
          var url;
          id = last._id.toString();
          url = last.url;
          return Url.findByUrl(url);
        }).then(function(found) {
          expect(found._id.toString()).to.equal(id);
          done();
        });
      });
    });
    describe('#findByShorten', function() {
      it('should return a url by its shorten', function(done) {
        var id, shorten;
        shorten = "";
        id = "";
        populateDatabase().then(function(last) {
          shorten = last.shorten;
          id = last._id.toString();
          return Url.findByShorten(shorten);
        }).then(function(found) {
          expect(found.shorten).to.equal(shorten);
          expect(found._id.toString()).to.equal(id);
          done();
        });
      });
    });
    return describe('#shortenify', function() {
      return it('should always return the same shorten', function(done) {
        var shorten1, url1;
        url1 = new Url();
        url1.url = 'http://shoretn-url.com';
        shorten1 = "";
        return url1.shortenify().then(function(shorten) {
          shorten1 = shorten;
          return url1.shortenify();
        }).then(function(shorten2) {
          expect(shorten1.length).to.equal(5);
          expect(shorten2.length).to.equal(5);
          expect(shorten1).to.equal(shorten2);
          done();
        });
      });
    });
  });

}).call(this);

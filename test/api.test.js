// Generated by CoffeeScript 1.10.0
(function() {
  var Url, expect, mocha, mongoose, request, sinon, url, www;

  mocha = require('mocha');

  sinon = require('sinon');

  expect = require('chai').expect;

  request = require('supertest');

  www = '../bin/www';

  mongoose = require('mongoose');

  url = 'http://localhost:3000';

  Url = require('../models/Url');

  describe('Routing', function() {
    var cleanUrlCollection, populateDatabase;
    cleanUrlCollection = function() {
      mongoose.connection.collections.urls.drop();
    };
    populateDatabase = function() {
      var url1, url2;
      url1 = new Url({
        url: "http://my-first-url.com",
        shorten: "12345"
      });
      url2 = new Url({
        url: "http://my-second-url.com",
        shorten: "15426"
      });
      return url1.save().then(function() {
        return url2.save();
      });
    };
    beforeEach(function() {
      cleanUrlCollection();
    });
    after(function() {
      cleanUrlCollection();
      mongoose.connection.close();
    });
    describe('GET /api/hello', function() {
      return it('should display Hello World Message', function(done) {
        return request(url).get('/api/hello').expect('Content-Type', /json/).expect(200).end(function(err, res) {
          expect(res.body).to.have.property('hello', 'world !');
          done();
        });
      });
    });
    describe('GET /api/urls', function() {
      it('should display all the added URLS', function(done) {
        return populateDatabase().then(function() {
          request(url).get('/api/urls').expect(200).expect('Content-Type', /json/).end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body.length).to.equal(2);
            done();
          });
        });
      });
      return it('should display the shorten of a given url', function(done) {
        var askedUrl, toUtl;
        askedUrl = "http://my-first-url.com";
        toUtl = encodeURIComponent(askedUrl);
        return populateDatabase().then(function(element) {
          return request(url).get("/api/urls/" + toUrl).expect(200).expect('Content-Type', /json/).end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.body).to.have.property('url', askedUrl);
            expect(res.body).to.have.property('shorten');
            done();
          });
        });
      });
    });
    describe('GET /api/urls?url=:url', function() {
      it('should redirect to /api/urls/:url', function(done) {
        var askedURL, toUri;
        askedURL = 'http://my-first-url.com';
        toUri = encodeURIComponent(askedURL);
        return populateDatabase().then(function() {
          return request(url).get("/api/urls?url=" + toUri).expect(302).end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.header.location).to.equal("/api/urls/" + toUri);
            done();
          });
        });
      });
      return it('should redirect to /api/urls/:url using clean URL', function(done) {
        var askedURL, toUri;
        askedURL = 'http://my-first-url.com';
        toUri = encodeURIComponent(askedURL);
        return populateDatabase().then(function() {
          return request(url).get("/api/urls?url=" + askedURL).expect(302).end(function(err, res) {
            expect(err).to.not.exist;
            expect(res.header.location).to.equal("/api/urls/" + toUri);
            done();
          });
        });
      });
    });
    describe('GET /api/shortens/:shorten', function() {
      return it('should display the expected url', function(done) {
        return populateDatabase().then(function(last) {
          var id, shorten;
          shorten = last.shorten;
          id = last._id;
          return request(url).get("/api/shortens/" + shorten).expect(200).expect('Content-Type', /json/).end(function(err, res) {
            expect(res.body._id).to.equal;
            done();
          });
        });
      });
    });
    describe('GET /api/urls?shorten=:shorten', function() {
      return it('should display the expected shortened url', function(done) {
        return populateDatabase().then(function(last) {
          var shorten;
          shorten = last.shorten;
          return request(url).get("/api/urls?shorten=" + shorten).expect(302).end(function(err, res) {
            expect(err).to.no.exist;
            expext(res.header.location).to.equal("/api/shotens/" + shorten);
            done();
          });
        });
      });
    });
    return describe('POST /api/urls', function() {
      it('should add a new url', function(done) {
        return request(url).post('/api/urls').send({
          url: 'http://a-new-url.com'
        }).expect(200).expect('Content-Type', /json/).end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.property('url', 'http://a-new-url.com');
          expect(res.body).to.have.property('shorten');
          done();
        });
      });
      return it('shoud not add twice the same url', function() {
        return request(url).post('/api/url').send({
          url: 'http://a-new-url.com'
        }).expect(200).expect('Content-Type', /json/).end(function(err, res) {
          var id;
          id = res.body._id;
          return request(url).post('/api/urls').send({
            url: 'http://a-new-url.com'
          }).expect(200).expect('Content-Type', /json/).end(function(e, r) {
            expect(r.body).to.have.property('url', 'http://a-new-url.com');
            expect(r.body).to.have.property('shorten');
            expect(r.body).to.have.property('id', id);
            done();
          });
        });
      });
    });
  });

}).call(this);

const assert = require('chai').assert;
const imageHash = require('../index');
const fs = require('fs');
const hdist = require('hamming-distance');

it('should create hash for jpeg', function() {
  return imageHash
    .hash(__dirname + '/files/absolut1')
    .then((hash) => {
      assert.ok(hash.hash);
    });
});

it('should create hash for png', function() {
  return imageHash
    .hash(__dirname + '/files/castle1.png')
    .then((hash) => {
      assert.ok(hash.hash);
    });
});

it('should create hash for bmp', function() {
  return imageHash
    .hash(__dirname + '/files/castle1.bmp')
    .then((hash) => {
      assert.ok(hash.hash);
    });
});

it('should create close hashes for the same image but in a diffrent format', function() {
  const h1 = imageHash.hash(__dirname + '/files/castle1.png');
  const h2 = imageHash.hash(__dirname + '/files/castle1.bmp');
  return Promise
    .all([h1, h2])
    .then((res) => {
      var dist = hdist(res[0].hash, res[1].hash);
      assert.isBelow(dist, 20);
    });
});

it('should create same hashes the same images', function() {
  const h1 = imageHash.hash(__dirname + '/files/castle1.png');
  const h2 = imageHash.hash(__dirname + '/files/castle2.png');
  return Promise
    .all([h1, h2])
    .then((res) => {
      assert.equal(res[0].hash, res[1].hash);
    });
});

it('should create different hashes different images', function() {
  const h1 = imageHash.hash(__dirname + '/files/castle1.png');
  const h2 = imageHash.hash(__dirname + '/files/absolut1');
  return Promise
    .all([h1, h2])
    .then((res) => {
      var dist = hdist(res[0].hash, res[1].hash);
      assert.isAbove(dist, 20);
    });
});

it('should create close hashes similar images', function() {
  const h1 = imageHash.hash(__dirname + '/files/absolut2', 64);
  const h2 = imageHash.hash(__dirname + '/files/absolut1', 64);
  return Promise
    .all([h1, h2])
    .then((res) => {
      var dist = hdist(res[0].hash, res[1].hash);
      assert.isBelow(dist, 1300);
    });
});

it('should support binary output', function() {
  const h1 = imageHash.hash(__dirname + '/files/absolut1', null, 'hex');
  const h2 = imageHash.hash(__dirname + '/files/absolut1', null, 'binary');
  return Promise
    .all([h1, h2])
    .then((res) => {
      assert.notEqual(res[0].hash, res[1].hash);
    });
});

it('should support validate output format', function() {
  imageHash.hash(__dirname + '/files/absolut1', null, 'foo').then(() => {
    assert.fail()
  }).catch(() => {})
});

it('should support variable bits length', function() {
  const h1 = imageHash.hash(__dirname + '/files/absolut1', 8);
  const h2 = imageHash.hash(__dirname + '/files/absolut1', 16);
  return Promise
    .all([h1, h2])
    .then((res) => {
      assert.equal(res[0].hash.length * 4, res[1].hash.length);
    });
});

it('should validate bit lengths', function() {
  imageHash.hash(__dirname + '/files/absolut1', 10).then(() => {
    assert.fail()
  }).catch(() => {})
});

it('should accept Buffer input', function() {
  const buffer = fs.readFileSync(__dirname + '/files/absolut1');
  const hash = imageHash.hash(buffer);
  return hash.then(res => {
    assert.isNotNull(res.hash);
    assert.notEqual(typeof res.hash, 'undefined');
  });
});

it('Buffer input should be the same as file path input', function() {
  const h1 = imageHash.hash(__dirname + '/files/absolut1', 64);
  const h2 = imageHash.hash(fs.readFileSync(__dirname + '/files/absolut1'), 64);
  return Promise
    .all([h1, h2])
    .then((res) => {
      assert.equal(res[0].hash, res[1].hash);
    });
});

it('Async should be the same as sync', function() {
  const h1 = imageHash.hash(__dirname + '/files/absolut1', 64);
  const h2 = imageHash.syncHash(__dirname + '/files/absolut1', 64);
  return Promise
    .all([h1, h2])
    .then((res) => {
      assert.equal(res[0].hash, res[1].hash);
    });
});

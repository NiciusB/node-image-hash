# node-image-hash [![npm version](https://badge.fury.io/js/node-image-hash.png)](https://badge.fury.io/js/node-image-hash)
Perceptual image hash for node.js

## Installation

```
npm install node-image-hash
```

## Basic usage

```javascript
const imageHash = require('node-image-hash');

imageHash
  .hash('buffer/or/path/to/file/', 8, 'hex')
  .then((hash) => {
    console.log(hash.hash); // '83c3d381c38985a5'
    console.log(hash.type); // 'blockhash8'
  });
```

## API

##### `.hash(filepath[, bits][, format])`

Returns: ES6 `Promise`, resolved returns hash string in specified format and length (eg. `83c3d381c38985a5`)

Parameters:

* `filepath` - path to the image, or `Buffer`
* `bits` (optional) - hash length [default: `64`]
* `format` (optional) - output format [default: `hex`] (Available: `hex`, `latin1`, `base64`, `binary`)


##### `.syncHash(filepath[, bits][, format])`

By default .hash generates new node.js processes to calculate the hash.
.syncHash will calculate the hash in the same node.js process (About 2.3x times slower)

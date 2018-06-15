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
    console.log(hash); // '83c3d381c38985a5'
  });
```
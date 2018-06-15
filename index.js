const imghash = require('imghash')
const fs = require('fs')
const crypto = require('crypto')
const child_process = require('child_process');

async function getImageHash(imageBuffer, blockhashSize = 256, format = 'hex') {
  if (!Buffer.isBuffer(imageBuffer)) {
    await new Promise((resolve, reject) => {
      fs.readFile(imageBuffer, (err, content) => {
        if (err) return reject(err)
        imageBuffer = content
        resolve()
      })
    })
  }

  try {
    const hash = await imghash.hash(imageBuffer, blockhashSize, format)
    return {
      hash: hash,
      type: `blockhash${blockhashSize}`
    }
  } catch (error) {
    // This always fails on GIFs, and maybe with some other edge cases too
    // Use sha256 which is not perceptual but better than nothing
    try {
      var hash = crypto.createHash('sha256').update(imageBuffer.toString('binary'))
      if (format === 'latin1') hash = hash.digest('latin1')
      else if (format === 'binary') hash = imghash.hexToBinary(hash.digest('hex'))
      else if (format === 'base64') hash = hash.digest('base64')
      else hash = hash.digest('hex')

      return {
        hash,
        type: 'sha256'
      }
    } catch (error) {
      return error
    }
  }
}

function multicoreGetImageHash(...getHashArgs) {
  return new Promise((resolve, reject) => {
    const child = child_process.fork(`${__dirname}/cli.js`, getHashArgs, {
      silent: true,
    })
    child.stdout.on('data', function(m) {
      resolve(JSON.parse(m.toString()))
    })
    child.stdout.on('exit', function(m) {
      // If promise is already resolved, rejection won't fire
      reject(m.toString())
    })
  })
}

module.exports = {
  hash: multicoreGetImageHash,
  syncHash: getImageHash
}

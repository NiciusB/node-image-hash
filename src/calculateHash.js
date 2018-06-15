const imghash = require('imghash')
const fs = require('fs')
const crypto = require('crypto')

module.exports = async function(imageBuffer, blockhashSize = 64, format = 'hex') {
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

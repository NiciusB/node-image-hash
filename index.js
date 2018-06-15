const imghash = require('imghash')
const fs = require('fs')
const crypto = require('crypto')

const getImageHash = async function(imageBuffer, blockhashSize = 256, format = 'hex') {
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
    throw new Error(error)
    // This always fails on GIFs, and maybe with some other edge cases too
    // Use sha256 which is not perceptual but better than nothing
    try {
      const hash = crypto.createHash('sha256').update(imageBuffer.toString('binary')).digest('hex')
      return {
        hash,
        type: 'sha256'
      }
    } catch (error) {
      return error
    }
  }
}

module.exports = {
  hash: getImageHash
}
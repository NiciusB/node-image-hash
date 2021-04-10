const imghash = require('imghash')
const fs = require('fs')
const crypto = require('crypto')

module.exports = async function (imageBuffer, blockhashSize = 64, format = 'hex', options = { useSha256Fallback: true }) {
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
    const imghashFormat = format === 'base64' || format === 'latin1' ? 'hex' : format
    let hash = await imghash.hash(imageBuffer, blockhashSize, imghashFormat)
    if (format === 'base64' || format === 'latin1') {
      hash = Buffer.from(hash, 'hex').toString(format)
    }

    return {
      hash: hash,
      type: `blockhash${blockhashSize}`
    }
  } catch (error) {
    if (!options.useSha256Fallback) {
      throw error
    }

    return sha256Fallback(imageBuffer, format, error)
  }
}

/**
 * This always fails on GIFs, and maybe with some other edge cases too
 * Use sha256 which is not perceptual but better than nothing
 */
function sha256Fallback (imageBuffer, format, error) {
  console.error('Something went wrong, using sha256 fallback.', error)

  let hash = crypto.createHash('sha256').update(imageBuffer.toString('binary'))
  if (format === 'latin1') hash = hash.digest('latin1')
  else if (format === 'binary') hash = imghash.hexToBinary(hash.digest('hex'))
  else if (format === 'base64') hash = hash.digest('base64')
  else hash = hash.digest('hex')

  return {
    hash,
    type: 'sha256'
  }
}

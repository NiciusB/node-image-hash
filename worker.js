const imageHash = require('./index')

var queueSize = 0
process.on('message', (content) => {
  queueSize++
  if (content.decodeBuffer) content.hashParams[0] = Buffer.from(content.hashParams[0], 'base64')
  imageHash.syncHash(...content.hashParams).then(res => {
    sendResponse(res, content.id)
  }).catch(err => {
    sendResponse(err, content.id)
  })
});

function sendResponse(result, id) {
  queueSize--
  process.send({
    id,
    result,
    queueSize
  })
}

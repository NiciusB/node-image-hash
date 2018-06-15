const imageHash = require('./index')

var queueSize = 0
process.on('message', (content) => {
  queueSize++
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

setInterval(() => {
  if (queueSize === 0) process.exit(0)
}, 10000)
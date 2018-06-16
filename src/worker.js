const calculateHash = require('./calculateHash')

process.on('message', (content) => {
  if (content.decodeBuffer) content.hashParams[0] = Buffer.from(content.hashParams[0], 'base64')
  calculateHash(...content.hashParams).then(res => {
    process.send({
      id: content.id,
      result: res
    })
  }).catch(err => {
    process.send({
      id: content.id,
      result: err
    })
  })
});

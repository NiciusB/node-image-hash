const calculateHash = require('./src/calculateHash')
const workersManager = require('./src/workersManager')

module.exports = {
  hash: function() {
    return workersManager.hash(...arguments)
  },
  syncHash: calculateHash
}

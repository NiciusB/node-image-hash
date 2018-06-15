const calculateHash = require('./src/calculateHash')
const WorkersManager = require('./src/workersManager')
const EventEmitter = require('events').EventEmitter
if (EventEmitter.prototype._maxListeners < 1000) EventEmitter.prototype._maxListeners = 1000;

var workersManager = false

module.exports = {
  hash: function() {
    if (!workersManager) workersManager = WorkersManager()
    return workersManager.hash(...arguments)
  },
  syncHash: calculateHash
}

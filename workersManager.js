const child_process = require('child_process')
const os = require('os')
const uuidv4 = require('uuid/v4')

module.exports = function() {
  return {
    workers: [],
    addNewWorker: function() {
      const worker = {
        queueSize: 0,
        process: child_process.fork(`${__dirname}/worker.js`, [], {
          silent: true,
        })
      }
      this.workers.push(worker)
      worker.process.on('message', response => {
        if (response && response.queueSize) worker.queueSize = response.queueSize
      })
      worker.process.on('exit', () => {
        this.workers.splice(this.workers.indexOf(worker), 1)
      })
      return worker
    },
    getWorker: function () {
      if (this.workers.length < os.cpus().length) {
        return this.addNewWorker()
      } else {
        return this.workers.sort((a, b) => a.queueSize > b.queueSize)[0]
      }
    },
    hash: function(...hashParams) {
      return new Promise((resolve, reject) => {
        const worker = this.getWorker()
        worker.queueSize++
        const id = uuidv4()

        const listenForResponse = (response) => {
          if (response.id != id) return true
          worker.process.removeListener('message', listenForResponse)
          worker.process.removeListener('exit', listenForExit)
          resolve(response.result)
        }
        const listenForExit = (response) => {
          worker.process.removeListener('message', listenForResponse)
          worker.process.removeListener('exit', listenForExit)
          reject(response)
        }
        worker.process.on('message', listenForResponse)
        worker.process.on('exit', listenForExit)

        var decodeBuffer = Buffer.isBuffer(hashParams[0])
        if (decodeBuffer) hashParams[0] = hashParams[0].toString('base64')
        worker.process.send({
          id,
          decodeBuffer,
          hashParams
        })
      })
    }
  }
}
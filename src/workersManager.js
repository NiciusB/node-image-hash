const child_process = require('child_process')
const os = require('os')
const uuidv4 = require('uuid/v4')

module.exports = {
  workers: [],
  maxWorkers: os.cpus().length,
  addNewWorker: function() {
    const worker = {
      queueSize: 0,
      idList: {},
      process: child_process.fork(`${__dirname}/worker.js`, [], {
        execArgv: [],
      })
    }

    worker.process.on('message', response => {
      worker.queueSize--
      if (!worker.idList[response.id]) return console.error('No id found in worker idList')
      worker.idList[response.id].resolve(response.result)
      delete worker.idList[response.id]
    })

    worker.process.on('exit', error => {
      this.workers.splice(this.workers.indexOf(worker), 1)
      for(key in worker.idList) {
        worker.idList[key].reject(error)
      }
    })

    this.workers.push(worker)
    return worker
  },
  getWorker: function () {
    if (this.workers.length < this.maxWorkers) {
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

      worker.idList[id] = {resolve, reject}

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
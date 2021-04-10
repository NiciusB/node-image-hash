const childProcess = require('child_process')
const os = require('os')
const path = require('path')

module.exports = {
  workers: [],
  maxWorkers: Math.max(1, os.cpus().length - 1),
  addNewWorker: function () {
    const worker = {
      queueSize: 0,
      idList: {},
      process: childProcess.fork(path.join(__dirname, 'worker.js'), [], {
        execArgv: []
      })
    }

    worker.process.on('message', response => {
      worker.queueSize--
      if (!worker.idList[response.id]) {
        console.error('[workersManager] No id found in worker idList')
        return
      }

      if (response.errorMessage) {
        worker.idList[response.id].reject(response.errorMessage)
      } else {
        worker.idList[response.id].resolve(response.result)
      }

      delete worker.idList[response.id]
    })

    worker.process.on('exit', error => {
      this.workers.splice(this.workers.indexOf(worker), 1)
      for (const key in worker.idList) {
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
      return this.workers.sort((a, b) => a.queueSize > b.queueSize ? 1 : -1)[0]
    }
  },
  hash: function (...hashParams) {
    return new Promise((resolve, reject) => {
      const worker = this.getWorker()
      worker.queueSize++
      const id = Math.random() + ''

      worker.idList[id] = { resolve, reject }

      const decodeBuffer = Buffer.isBuffer(hashParams[0])
      if (decodeBuffer) hashParams[0] = hashParams[0].toString('base64')
      worker.process.send({
        id,
        decodeBuffer,
        hashParams
      })
    })
  },

  /**
   * Close all workers
   */
  close: function () {
    this.workers.forEach(worker => {
      worker.process.kill('SIGINT') // Terminate the process.
    })
  }
}

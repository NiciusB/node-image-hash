const imageHash = require('./index')
const precise = require('precise')
const path = require('path')

async function test () {
  console.log('Calculating async times')
  let hashes = []
  let timer = precise()
  timer.start()
  for (let k = 0; k < 500; k++) {
    hashes.push(imageHash.hash(path.join(__dirname, 'test', 'files', 'castle2.png')))
  }
  await Promise.all(hashes).then(() => {
    timer.stop()
    console.log('Async: ' + timer.diff() / 1000000 + 'ms')
  })

  console.log('Calculating sync times')
  hashes = []
  timer = precise()
  timer.start()
  for (let k = 0; k < 500; k++) {
    hashes.push(imageHash.syncHash(path.join(__dirname, 'test', 'files', 'castle2.png')))
  }
  await Promise.all(hashes).then(() => {
    timer.stop()
    console.log('Sync: ' + timer.diff() / 1000000 + 'ms')
  })

  imageHash.close()
}

test()

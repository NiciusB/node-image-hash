const imageHash = require('./index');
const precise = require('precise');

async function test() {

  console.log('Calculating async times');
  hashes = []
  timer = precise()
  timer.start();
  for (var k = 0; k < 500; k++) {
    hashes.push(imageHash.hash(__dirname + '/test/files/castle2.png'))
  }
  await Promise.all(hashes).then(() => {
    timer.stop();
    console.log('Async: ' + timer.diff() / 1000000 + 'ms');
  })

  console.log('Calculating sync times');
  hashes = []
  timer = precise();
  timer.start();
  for (var k = 0; k < 500; k++) {
    hashes.push(imageHash.syncHash(__dirname + '/test/files/castle2.png'))
  }
  await Promise.all(hashes).then(() => {
    timer.stop();
    console.log('Sync: ' + timer.diff() / 1000000 + 'ms');
  })

}

test()

#!/usr/bin/env node
const imageHash = require('./index')

const args = process.argv.splice(2)

imageHash.syncHash(...args).then(res => {
  process.stdout.write(JSON.stringify(res))
}).catch(err => {
  process.stdout.write(JSON.stringify(err))
})
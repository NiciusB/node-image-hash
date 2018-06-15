#!/usr/bin/env node
const imageHash = require('./index')

const args = process.argv.splice(2)

imageHash.hash(...args).then(res => {
  process.stdout.write(JSON.stringify(res))
  process.exit(0)
}).catch(err => {
  process.stdout.write(JSON.stringify(err))
  process.exit(0)
})
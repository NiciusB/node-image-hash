#!/usr/bin/env node
const imageHash = require('./index')

const args = process.argv.splice(2)

imageHash.hash(...args).then(res => {
  console.log(res)
}).catch(err => {
  console.error(err)
})
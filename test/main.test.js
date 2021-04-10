import imageHash from '../index'
import hdist from 'hamming-distance'
import path from 'path'
import fs from 'fs'

test('should create hash for jpeg', () => {
  return imageHash.hash(path.join(__dirname, 'files', 'absolut1')).then((hash) => {
    expect(hash.hash).toBeTruthy()
  })
})

test('should create hash for png', () => {
  return imageHash.hash(path.join(__dirname, 'files', 'castle1.png')).then((hash) => {
    expect(hash.hash).toBeTruthy()
  })
})

test('should create hash for bmp', () => {
  return imageHash.hash(path.join(__dirname, 'files', 'castle1.bmp')).then((hash) => {
    expect(hash.hash).toBeTruthy()
  })
})

test('should create close hashes for the same image but in a diffrent format', () => {
  const h1 = imageHash.hash(path.join(__dirname, 'files', 'castle1.png'))
  const h2 = imageHash.hash(path.join(__dirname, 'files', 'castle1.bmp'))
  return Promise.all([h1, h2]).then((res) => {
    const dist = hdist(res[0].hash, res[1].hash)
    expect(dist).toBeLessThan(20)
  })
})

test('should create same hashes the same images', () => {
  const h1 = imageHash.hash(path.join(__dirname, 'files', 'castle1.png'))
  const h2 = imageHash.hash(path.join(__dirname, 'files', 'castle2.png'))
  return Promise.all([h1, h2]).then((res) => {
    expect(res[0].hash).toEqual(res[1].hash)
  })
})

test('should create different hashes different images', () => {
  const h1 = imageHash.hash(path.join(__dirname, 'files', 'castle1.png'))
  const h2 = imageHash.hash(path.join(__dirname, 'files', 'absolut1'))
  return Promise.all([h1, h2]).then((res) => {
    const dist = hdist(res[0].hash, res[1].hash)
    expect(dist).toBeGreaterThan(20)
  })
})

test('should create close hashes similar images', () => {
  const h1 = imageHash.hash(path.join(__dirname, 'files', 'absolut2'), 64)
  const h2 = imageHash.hash(path.join(__dirname, 'files', 'absolut1'), 64)
  return Promise.all([h1, h2]).then((res) => {
    const dist = hdist(res[0].hash, res[1].hash)
    expect(dist).toBeLessThan(1300)
  })
})

test('should support binary output', () => {
  const h1 = imageHash.hash(path.join(__dirname, 'files', 'absolut1'), null, 'hex')
  const h2 = imageHash.hash(path.join(__dirname, 'files', 'absolut1'), null, 'binary')
  return Promise.all([h1, h2]).then((res) => {
    expect(res[0].hash).not.toEqual(res[1].hash)
  })
})

test('should support validate output format', async () => {
  return expect(
    imageHash.hash(path.join(__dirname, 'files', 'absolut1'), null, 'foo', {
      useSha256Fallback: false
    })
  ).rejects.toEqual('Unsupported format')
})

test('should support variable bits length', () => {
  const h1 = imageHash.hash(path.join(__dirname, 'files', 'absolut1'), 8)
  const h2 = imageHash.hash(path.join(__dirname, 'files', 'absolut1'), 16)
  return Promise.all([h1, h2]).then((res) => {
    expect(res[0].hash.length * 4).toEqual(res[1].hash.length)
  })
})

test('should validate bit lengths', async () => {
  return expect(
    imageHash.hash(path.join(__dirname, 'files', 'absolut1'), 10, 'hex', {
      useSha256Fallback: false
    })
  ).rejects.toEqual('Invalid bitlength')
})

test('should accept Buffer input', () => {
  const buffer = fs.readFileSync(path.join(__dirname, 'files', 'absolut1'))
  const hash = imageHash.hash(buffer)
  return hash.then((res) => {
    expect(res.hash).not.toBeNull()
    expect(typeof res.hash).not.toEqual('undefined')
  })
})

test('Buffer input should be the same as file path input', () => {
  const h1 = imageHash.hash(path.join(__dirname, 'files', 'absolut1'), 64)
  const h2 = imageHash.hash(fs.readFileSync(path.join(__dirname, 'files', 'absolut1')), 64)
  return Promise.all([h1, h2]).then((res) => {
    expect(res[0].hash).toEqual(res[1].hash)
  })
})

test('Async should be the same as sync', () => {
  const h1 = imageHash.hash(path.join(__dirname, 'files', 'absolut1'), 64)
  const h2 = imageHash.syncHash(path.join(__dirname, 'files', 'absolut1'), 64)
  return Promise.all([h1, h2]).then((res) => {
    expect(res[0].hash).toEqual(res[1].hash)
  })
})

afterAll(function () {
  imageHash.close()
})

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express'
import { Data } from '@rfiready/data'
import a from 'nx.json'

console.log(a.affected)

const data: Data = {
  test: 'testing!! affected!! double!!! yes',
}
const app = express()

app.get('/api', (req, res) => {
  res.send({ message: data })
})
const port = 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)

console.log('testing 2')

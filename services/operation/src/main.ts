/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express'
import { tryCatch } from '@rfiready/utils'
console.log(tryCatch)
const app = express()
app.get('/api', (req, res) => {
  res.send({ message: 'testing demo!' })
})
const port = 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)

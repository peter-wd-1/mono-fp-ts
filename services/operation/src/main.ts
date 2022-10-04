/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express'
import { tryCatch } from '@rfiready/utils'
const app = express()
console.log({ tryCatch })
app.get('/api', (req, res) => {
  res.send({ message: 'testing' })
})
const port = 3333
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)

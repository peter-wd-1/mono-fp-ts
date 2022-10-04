/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express'
import { tryCatch } from '@rfiready/utils'

const app = express()

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to test! testing server' + JSON.stringify(tryCatch) })
})

const port = 3332
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)

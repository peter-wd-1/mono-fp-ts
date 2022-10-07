/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
//testing
import express from 'express'

const app = express()

app.get('/api', (req:any, res:any) => {
  res.send({ message: 'Welcome to test1!' })
})

const port = 1234
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
server.on('error', console.error)

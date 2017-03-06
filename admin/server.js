const express = require('express')
const app = express()

app.listen(81)

app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html')
})

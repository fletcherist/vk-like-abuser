const express = require('express')
const app = express()

app.listen(1488)

app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html')
})

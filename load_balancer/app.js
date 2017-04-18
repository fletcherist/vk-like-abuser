const express = require('express')
const fs = require('fs')

var http = require('http')
var https = require('https')
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8')
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8')

var credentials = {key: privateKey, cert: certificate}
var express = require('express')
var app = express()

var httpServer = http.createServer(app)
var httpsServer = https.createServer(credentials, app)

httpServer.listen(8080)
httpsServer.listen(8443)


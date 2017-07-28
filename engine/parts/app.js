const admin = require('firebase-admin')
const SegmentAnalytics = require('analytics-node')

const config = require('../config')
const serviceAccount = require('../firebase-key.json')

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebase.databaseURL
})

module.exports = app
module.exports.db = app.database()
module.exports.segmentClient = new SegmentAnalytics(config.segment.analyticsWriteKey)
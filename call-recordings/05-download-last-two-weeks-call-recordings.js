// ----------------------------------------------------------------------------
// DOWNLOAD ALL CALL RECORDINGS OF THE LAST 15 DAYS
// ----------------------------------------------------------------------------
// This sample code retrieves all call recordings available on your
// organization made over the last two weeks.


// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (httplease and fs)
// ----------------------------------------------------------------------------
var fs = require('fs')
const httplease = require("httplease");
const CallRecordingsConnector = require('../connectors/CallRecordingsConnector')

var connector = new CallRecordingsConnector(config)

// ----------------------------------------------------------------------------
// Download recordings sequentially
// ----------------------------------------------------------------------------
function downloadCallRecordings(calls) {
  return calls.reduce((p, cr) => {
      var file = cr.recordingId + ".wav"

      if (!fs.existsSync(file)) {
        return p.then(() => {
          console.log(" Download call recording id: " + cr.recordingId + " started at " + cr.startedAt)
          return connector
            .downloadCallRecPromise(cr.recordingId, (response) => response.pipe(fs.createWriteStream(file)))
            .catch(err => {
                console.error("Failed to download call recording with id " + cr.recordingId + ": " + err.message)
                return cr.recordingId
            })
            .then(wrappedresponse => {
              console.log(" Downloaded " + cr.recordingId)
              return cr.recordingId;
            })
        })
      } else {
        return p.then(() => {
            console.log(" Download call recording id: " + cr.recordingId + " NOT needed, file already exists");
            return Promise.resolve()})
      }
    },
    Promise.resolve()
  )
}

// ----------------------------------------------------------------------------
// Very basic error handler
// ----------------------------------------------------------------------------
function bailOut(err) {
    if (err instanceof httplease.errors.UnexpectedHttpResponseCodeError) {
        console.log(err.response.statusCode);
        console.log(err.response.headers);
        console.log(err.response.body);
    } else {
        console.log(err.message)
    }

    process.exit(1);
}

// ----------------------------------------------------------------------------
// Recursively get call recordings from the API and keep those made over the
// last two weeks. This function returns a promise.
// ----------------------------------------------------------------------------
var twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // take 14 days from the date
var twoWeeksAgoIsoDate = twoWeeksAgo.toISOString()

var callReqsToKeep = []
var pageCounter = 0

function getCallRecordingsPromise(cursor) {
  return connector.getAllCallRecsPromise(cursor, twoWeeksAgoIsoDate, null)
    .catch(bailOut)
    .then(pageOfCallRecs => {
      pageOfCallRecs.data.forEach(cr => callReqsToKeep.push(cr))
      console.log("\nPage " + (++pageCounter) + " with " + pageOfCallRecs.data.length + " call recordings and " + callReqsToKeep.length + " made since two weeks ago");

      if (pageOfCallRecs.pagination.cursor != null) {
        return getCallRecordingsPromise(pageOfCallRecs.pagination.cursor)
      } else {
        return Promise.resolve(callReqsToKeep)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
console.log("Downloading all call recordings made since " + twoWeeksAgoIsoDate)
getCallRecordingsPromise(null)
  .then(callRecordings => {
    console.log("Found a total of " + callRecordings.length + " call recordings made over the last two weeks")
    downloadCallRecordings(callRecordings)
  })
// ----------------------------------------------------------------------------

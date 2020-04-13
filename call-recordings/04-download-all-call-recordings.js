// ----------------------------------------------------------------------------
// DOWNLOAD ALL CALL RECORDINGS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code retrieves all call recordings available for your
// organization.
// The call recordings returned in the responses are only limited by the scope
// of the authentication token.

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (httplease and node-stringbuilder)
// ----------------------------------------------------------------------------
var fs = require('fs')
const StringBuilder = require('node-stringbuilder')
const httplease = require("httplease");
const CallRecordingsConnector = require('../connectors/CallRecordingsConnector')
var connector = new CallRecordingsConnector(config)
var pageCounter = 0;
var callRecordings = []

// ----------------------------------------------------------------------------
// Download recordings sequentially
// ----------------------------------------------------------------------------
function downloadCallRecordings(calls) {
  calls.reduce((p, cr) => p.then(_ => {
      var file = cr.recordingId + ".wav"
      if (!fs.existsSync(file)) {
        console.log(" Download call recording id: " + cr.recordingId)
        return connector
            .downloadCallRecPromise(cr.recordingId, (response) => response.pipe(fs.createWriteStream(file)))
            .catch(err => console.error("Failed to download call recording with id " + cr.recordingId + ": " + err.message))
            .then(x => console.log(" Downloaded " + cr.recordingId))
      } else {
        console.log(" Download call recording id: " + cr.recordingId + " NOT needed, file already exists")
        return Promise.resolve()
      }
    }),
    Promise.resolve()
  )
}

// ----------------------------------------------------------------------------
// add all call recording from a page of call recordings to the array
// ----------------------------------------------------------------------------
function keepRecordings(responseRecordingsList) {
  responseRecordingsList.forEach(function (r) {
    callRecordings.push(r)
  })
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
// Recursively get pages of call recordings from the API.
// This function returns a promise with all the call recording IDs.
// ----------------------------------------------------------------------------
function getTotalCallRecordingsPromise(cursor) {
  return connector.getAllCallRecsPromise(cursor)
    .catch(bailOut)
    .then(pageOfCallRecs => {
      console.log("\nPage " + (++pageCounter) + " with " + pageOfCallRecs.data.length + " call recordings");
      keepRecordings(pageOfCallRecs.data)

      if (pageOfCallRecs.pagination.cursor != null) {
        return getTotalCallRecordingsPromise(pageOfCallRecs.pagination.cursor)
      } else {
        return Promise.resolve(callRecordings)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
getTotalCallRecordingsPromise(null)
  .then(allCallRecording => {
    console.log("Found a total of " + allCallRecording.length + " call recordings, will now download audio")
    downloadCallRecordings(allCallRecording)
  })

// ----------------------------------------------------------------------------

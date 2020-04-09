// ----------------------------------------------------------------------------
// DOWNLOAD ALL CALL RECORDINGS OF THE LAST 15 DAYS
// ----------------------------------------------------------------------------
// This sample code retrieves all call recordings available on your
// organization made over the last two weeks.


// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

var twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // take 14 days from the date

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
function downloadCallRecordingss(calls) {
  calls.reduce((p, cr) => p.then(_ => {
        console.log(" Download call recording id: " + cr.recordingId)
        return connector
            .downloadCallRecPromise(cr.recordingId, (response) => response.pipe(fs.createWriteStream(cr.recordingId + ".wav")))
            .catch(err => console.error("Failed to download call recording with id " + cr.recordingId + ": " + err.message))
            .then(x => console.log(" Downloaded " + cr.recordingId))
      }),
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
// Filter: ignore call recordings made before "notBefore"
// ----------------------------------------------------------------------------
function filterOnlyThoseAfterDate(pageOfCallRecs, notBefore) {
  var filteredCallRecs = [];

  pageOfCallRecs.data.forEach(function(callRec) {
    var callDate = new Date(callRec.startedAt);
    if (callDate > notBefore) {
      filteredCallRecs.push(callRec);
    }
  });

  return filteredCallRecs;
}

// ----------------------------------------------------------------------------
// Recursively get call recordings from the API and keep those made over the
// last two weeks. This function returns a promise.
// ----------------------------------------------------------------------------
var twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // take 14 days from the date
var callReqsToKeep = []
var pageCounter = 0

function getCallRecordingsPromise(cursor) {
  return connector.getAllCallRecsPromise(cursor)
    .catch(bailOut)
    .then(pageOfCallRecs => {
      var filteredCallRecsFromPage = filterOnlyThoseAfterDate(pageOfCallRecs, twoWeeksAgo)

      console.log("\nPage " + (++pageCounter) + " with " + pageOfCallRecs.data.length + " call recordings and " + filteredCallRecsFromPage.length + " made since two weeks ago");
      filteredCallRecsFromPage.forEach(cr => callReqsToKeep.push(cr))

      if (pageOfCallRecs.pagination.cursor != null && filteredCallRecsFromPage.length > 0) {
        return getCallRecordingsPromise(pageOfCallRecs.pagination.cursor)
      } else {
        return Promise.resolve(callReqsToKeep)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
getCallRecordingsPromise(null)
  .then(callRecordings => {
    console.log("Found a total of " + callRecordings.length + " call recordings made over the last two weeks")
    downloadCallRecordingss(callRecordings)
  })
// ----------------------------------------------------------------------------

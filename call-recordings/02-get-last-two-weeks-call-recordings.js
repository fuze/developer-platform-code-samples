// ----------------------------------------------------------------------------
// GET ALL CALL RECORDINGS OF THE LAST 15 DAYS
// ----------------------------------------------------------------------------
// This sample code retrieves all call recordings available for your
// organization made over the last two weeks.


// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

var twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14); // take 14 days from the date

// ----------------------------------------------------------------------------
// Dependencies (httplease and node-stringbuilder)
// ----------------------------------------------------------------------------
const StringBuilder = require('node-stringbuilder')
const httplease = require("httplease");
const CallRecordingsConnector = require('../connectors/CallRecordingsConnector')

var connector = new CallRecordingsConnector(config)

// ----------------------------------------------------------------------------
// Displays the recordingIds of recordings made over the last 14 days
// ----------------------------------------------------------------------------
function showCalls(calls) {
  var listOfRecordingIds = new StringBuilder();
  calls.forEach(cr => listOfRecordingIds.append(cr.recordingId).append(', '))
  console.log(" Call recordings Ids: " + listOfRecordingIds.toString())
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
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 1); // take 14 days from the date
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
    showCalls(callRecordings)
  })
// ----------------------------------------------------------------------------

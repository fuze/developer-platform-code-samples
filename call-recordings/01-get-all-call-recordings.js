// ----------------------------------------------------------------------------
// GET ALL CALL RECORDINGS SAMPLE CODE
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
const StringBuilder = require('node-stringbuilder')

const httplease = require("httplease");
const CallRecordingsConnector = require('../connectors/CallRecordingsConnector')
var connector = new CallRecordingsConnector(config)
var pageCounter = 0;
var callRecordingIds = []

// ----------------------------------------------------------------------------
// log recording IDs on a page of call recordings
// ----------------------------------------------------------------------------
function logCallRecordingIds(recordingsList) {
  // do something fancy here
  var listOfRecordingIds = new StringBuilder();
  recordingsList.forEach(function (r) {
    listOfRecordingIds.append(r.recordingId).append(', ');
  })
  console.log(' ids: ' + listOfRecordingIds.toString())
}
// ----------------------------------------------------------------------------
// add all recording IDs from a page of call recordings to the array
// ----------------------------------------------------------------------------
function keepRecordingIds(recordingsList) {
  recordingsList.forEach(function (r) {
    callRecordingIds.push(r.recordingId)
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
  return connector.getAllCallRecsPromise(cursor, null, null)
    .catch(bailOut)
    .then(pageOfCallRecs => {
      console.log("\nPage " + (++pageCounter) + " with " + pageOfCallRecs.data.length + " call recordings");
      logCallRecordingIds(pageOfCallRecs.data)
      keepRecordingIds(pageOfCallRecs.data)

      if (pageOfCallRecs.pagination.cursor != null) {
        return getTotalCallRecordingsPromise(pageOfCallRecs.pagination.cursor)
      } else {
        return Promise.resolve(callRecordingIds)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
getTotalCallRecordingsPromise(null)
  .then(allRecordingIds => console.log("Found a total of " + allRecordingIds.length + " call recordings"))
// ----------------------------------------------------------------------------

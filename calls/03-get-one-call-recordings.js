// ----------------------------------------------------------------------------
// GET ONE CALL RECORDINGS BY CALL ID
// ----------------------------------------------------------------------------
// This sample code retrieves one call recordings when you pass the call id
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
var fs = require("fs")
const CallsConnector = require('../connectors/CallsConnector.js')
const CallRecordingsConnector = require('../connectors/CallRecordingsConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// show call information
// ----------------------------------------------------------------------------
function showCallInfo(body) {
    call = body.data
  console.log("call id " + call.linkedId);
  console.log(JSON.stringify(call, null, 2))
}

// ----------------------------------------------------------------------------
// Recursively get pages of calls from the API.
// This function returns a promise with all the call IDs.
// ----------------------------------------------------------------------------
var pageCounter = 0
var callRecordingIds = []
function getAllCallRecordingIdsPromise(callId, cursor) {
    return connector.getCallRecordingsPromise(callId, cursor)
      .catch(HttpErrorHandler.bailOut)
      .then(pageOfCallRecordings => {
        console.log("\nPage " + (++pageCounter) + " with " + pageOfCallRecordings.data.length + " calls");
        
        pageOfCallRecordings.data.forEach(function (cr) {
            callRecordingIds.push(cr.recordingId)
          })
  
        if (pageOfCallRecordings.pagination.cursor != null) {
          return getAllCallRecordingIdsPromise(callId, pageOfCallRecordings.pagination.cursor)
        } else {
          return Promise.resolve(callRecordingIds)
        }
      })
}

function downloadCallRecording(id) {

    var file = id + ".wav"
    if (!fs.existsSync(file)) {
        console.log(" Download call recording id: " + id)
        return callRecsConnector
            .downloadCallRecPromise(id, (response) => response.pipe(fs.createWriteStream(file)))
            .catch(err => console.error("Failed to download call recording with id " + id + ": " + err.message))
            .then(x => console.log(" Downloaded " + id))
    } else {
        console.log(" Download call recording id: " + id + " NOT needed, file already exists")
        return Promise.resolve()
    }
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new CallsConnector(config);
var callRecsConnector = new CallRecordingsConnector(config);

if (process.argv.length < 3) {
  console.log("Invalid number of parameters... missing call ID")
} else {
  callId = process.argv[2];

  getAllCallRecordingIdsPromise(callId, null)
    .catch(err => HttpErrorHandler.bailOut(err, "callrecordings_read"))
    .then(callRecIdList => {
        console.log("call id " + callId + " has " + callRecIdList.length + " recordings")
        callRecIdList.forEach(downloadCallRecording)
    })
}
// ----------------------------------------------------------------------------
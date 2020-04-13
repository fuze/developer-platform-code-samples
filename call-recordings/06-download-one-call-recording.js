// ----------------------------------------------------------------------------
// GET ONE CALL RECORDING BY ID
// ----------------------------------------------------------------------------
// Fetches one call recording and show its metadata

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (httplease)
// ----------------------------------------------------------------------------
var fs = require("fs")
const httplease = require("httplease");
const CallRecordingsConnector = require('../connectors/CallRecordingsConnector')

var connector = new CallRecordingsConnector(config)

// ----------------------------------------------------------------------------
// Download one call recording
// ----------------------------------------------------------------------------
function downloadCallRecording(cr) {

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
// Main
// ----------------------------------------------------------------------------
if (process.argv.length < 3) {
  console.log("Invalid number of parameters... missing recording ID")
} else {
  myRecordingId = process.argv[2];
  connector.getCallRecPromise(myRecordingId)
      .catch(bailOut)
      .then(callRecordingBody => {
        downloadCallRecording(callRecordingBody.data)
      });
}
// ----------------------------------------------------------------------------

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
const httplease = require("httplease");
const CallRecordingsConnector = require('../connectors/CallRecordingsConnector')

var connector = new CallRecordingsConnector(config)

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
function handleRecording(response) {
  console.log("\nCall recording metadata\n" + JSON.stringify(response.body.data));
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
      .then(callRecording => {
        handleRecording(callRecording)
      });
}
// ----------------------------------------------------------------------------

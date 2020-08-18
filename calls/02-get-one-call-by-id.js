// ----------------------------------------------------------------------------
// GET ONE CALL METADATA BY ID
// ----------------------------------------------------------------------------
// This sample code retrieves one call metadata when you pass its id
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const CallsConnector = require('../connectors/CallsConnector.js')
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
// Main
// ----------------------------------------------------------------------------
var connector = new CallsConnector(config)

if (process.argv.length < 3) {
  console.log("Invalid number of parameters... missing call ID")
} else {
  callId = process.argv[2];

  connector.getCallPromise(callId)
    .catch(err => HttpErrorHandler.bailOut(err, "calls_read"))
    .then(body => showCallInfo(body))
}
// ----------------------------------------------------------------------------
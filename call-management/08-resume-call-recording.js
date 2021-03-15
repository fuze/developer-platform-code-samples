// ----------------------------------------------------------------------------
// RESUME RECORDING OF AN ONGOING CALL SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code is interactive.
// It lists one user's ongoing calls and asks which one to resume the recording.

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const CallManagementConnector = require('../connectors/CallManagementConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')
const CallUtils = require('./CallUtils.js')
var readline = require("readline-sync");

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new CallManagementConnector(config)

if (process.argv.length < 3) {
    console.log("Invalid number of parameters...\nParameters: 'userId'\n")
    console.log("'userId'     id of the user")
} else {
    userId = process.argv[2];

    console.log("List of user " + userId + "'s ongoing calls")

    connector.listUserOngoingCallsPromise(userId)
        .catch(err => HttpErrorHandler.bailOut(err, "calls_read"))
        .then(body => {
            CallUtils.showCalls(body.data)
            if (body.data.length > 0) {
                console.log("\n\nSelect one call id to resume the recording")
                var callId = readline.question("CallId: ")
                return connector.resumeCallRecordingPromise(callId)      
            } else {
                process.exit(0)
            }
        })
        .then(body => {
            var msg = body.msg;
            console.log("API response: " + msg);
        })
}
// ----------------------------------------------------------------------------

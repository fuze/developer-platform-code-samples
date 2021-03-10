// ----------------------------------------------------------------------------
// TRANSFER AN ONGOING CALL SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code is interactive.
// It lists one user's ongoing calls and asks which one to transfer

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
                console.log("\n\nSelect the call id and type the phone number to where the call should be transferred to")
                var callId = readline.question("Transfer callId: ")
                var destinationNumber = readline.question("To phone number (must belong to your organization): ")
                return connector.transferCallPromise(callId, destinationNumber)      
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

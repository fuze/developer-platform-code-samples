// ----------------------------------------------------------------------------
// TAKE A CALL FROM SERVER SIDE HOLD SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code is interactive.
// It lists one user's related calls and asks which one to take from server 
// side hold

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

    console.log("List of user " + userId + "'s related calls")

    connector.listUserRelatedCallsPromise(userId)
        .catch(err => HttpErrorHandler.bailOut(err, "calls_read"))
        .then(body => {
            CallUtils.showCalls(body.data)
            if (body.data.length > 0) {
                console.log("\n\nSelect one call id to unhold it")
                var callId = readline.question("Unhold callId: ")
                var userIdTakingTheCall = readline.question("User ID taking the call: ")
                return connector.unholdCallPromise(callId, userIdTakingTheCall)      
            } else {
                process.exit(0)
            }
        })
        .catch(err => HttpErrorHandler.bailOut(err, "calls_manage"))
        .then(body => {
            var msg = body.msg;
            console.log("API response: " + msg);
        })
}
// ----------------------------------------------------------------------------

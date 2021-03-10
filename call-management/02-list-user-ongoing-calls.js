// ----------------------------------------------------------------------------
// LIST USER ONGOING CALLS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code will request the list of ongoing calls of one user of
// your organization.

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

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new CallManagementConnector(config)

if (process.argv.length < 3) {
    console.log("Invalid number of parameters...\nParameters: 'userId'\n")
    console.log("'userId'     id of the user")
} else {
    userId = process.argv[2];

    console.log("List user " + userId + "'s ongoing calls")

    connector.listUserOngoingCallsPromise(userId)
        .catch(err => HttpErrorHandler.bailOut(err, "calls_read"))
        .then(body => {
            CallUtils.showCalls(body.data)
        })
}
// ----------------------------------------------------------------------------

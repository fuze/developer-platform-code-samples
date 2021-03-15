// ----------------------------------------------------------------------------
// LIST USER RELATED CALLS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code will request the list of related calls of one user of
// your organization. 
// Related calls are calls a user of your organization has placed on hold on 
// the call server.

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

    console.log("List of user " + userId + "'s related calls")

    connector.listUserRelatedCallsPromise(userId)
        .catch(err => HttpErrorHandler.bailOut(err, "calls_read"))
        .then(body => {
            CallUtils.showCalls(body.data)
        })
}
// ----------------------------------------------------------------------------

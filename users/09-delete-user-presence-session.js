// ----------------------------------------------------------------------------
// DELETE USER PRESENCE SESSION
// ----------------------------------------------------------------------------
// This sample code deletes an existing user presence session.
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const UsersConnector = require('../connectors/UsersConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new UsersConnector(config)
if (process.argv.length < 4) {
    console.log("Invalid number of parameters...")
    console.log("Required params: userId status heartbeat originRequester originVersion")
    console.log("  userId     : numeric user identifier")
    console.log("  sessionId  : existing session identifier")

    process.exit(1)
} else {
    userId = process.argv[2];
    sessionId = process.argv[3];
}

connector.deleteUserPresenceSessionPromise(userId, sessionId)
    .catch(err => HttpErrorHandler.bailOut(err, "presence_manage"))
    .then(data => {
        console.log("Your session " + data.id + " is now deleted")
      console.log(JSON.stringify(data, null, 2))
    })
// ----------------------------------------------------------------------------

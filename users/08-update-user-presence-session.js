// ----------------------------------------------------------------------------
// UPDATE USER PRESENCE SESSION
// ----------------------------------------------------------------------------
// This sample code updates an existing user presence session.
// It lets you change its status and heartbeat.
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
if (process.argv.length < 6) {
    console.log("Invalid number of parameters...")
    console.log("Required params: userId status heartbeat originRequester originVersion")
    console.log("  userId     : numeric user identifier")
    console.log("  sessionId  : existing session identifier")
    console.log("  status     : available, busy or idle")
    console.log("  heartbeat  : session expiration in seconds, between 60 and 43200 (12h)")
    process.exit(1)
} else {
    userId = process.argv[2];
    sessionId = process.argv[3];
    status = process.argv[4];
    heartbeat = process.argv[5];
}

connector.updateUserPresenceSessionPromise(userId, sessionId, heartbeat, status, [])
    .catch(err => HttpErrorHandler.bailOut(err, "presence_manage"))
    .then(data => {
        console.log("Your session " + data.id + " is now updated")
      console.log(JSON.stringify(data, null, 2))
    })
// ----------------------------------------------------------------------------

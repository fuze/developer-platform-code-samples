// ----------------------------------------------------------------------------
// CREATE USER PRESENCE SESSION
// ----------------------------------------------------------------------------
// This sample code creates a user presence session to manipulate the user's 
// session status.
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
if (process.argv.length < 7) {
    console.log("Invalid number of parameters...")
    console.log("Required params: userId status heartbeat originRequester originVersion")
    console.log("  userId         : numeric user identifier")
    console.log("  status         : available, busy or idle")
    console.log("  heartbeat      : session expiration in seconds, between 60 and 43200 (12h)")
    console.log("  originRequester: session name, example: 'awesome-integration-app'")
    console.log("  originVersion  : version of your integration app, example: '1.0'")
    process.exit(1)
} else {
    userId = process.argv[2];
    status = process.argv[3];
    heartbeat = process.argv[4];
    originRequester = process.argv[5];
    originVersion = process.argv[6];
}

connector.createUserPresenceSessionPromise(userId, originRequester, originVersion, heartbeat, status, [])
    .catch(err => HttpErrorHandler.bailOut(err, "presence_manage"))
    .then(data => {
        console.log("Your new session id is " + data.id)
      console.log(JSON.stringify(data, null, 2))
    })
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// GET ALL USER PRESENCE SESSIONS
// ----------------------------------------------------------------------------
// This sample code retrieves all the user's presence sessions
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const sprintf = require('sprintf-js').sprintf
const UsersConnector = require('../connectors/UsersConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// Recursively get users from the API, one page at a time.
// This function returns a promise.
// ----------------------------------------------------------------------------
var sessionsCounter = 0;
var pageNumber = 0;
function getPresenceSessionsPromise(userId, cursor) {
  return connector.getUserPresenceSessionsPromise(userId, cursor)
    .catch(err => HttpErrorHandler.bailOut(err, "presence_read"))
    .then(pageOfSessions => {
        console.log("\nPage " + ++pageNumber + " with " + pageOfSessions.data.length + " sessions")
        pageOfSessions.data.forEach(session => console.log("  id: %s, originRequester: %s, heartbeat: %s, status: %s", session.id, session.originRequester, session.heartbeat, session.presence.status))

        sessionsCounter += pageOfSessions.data.length;
        if (pageOfSessions.pagination.cursor != null) {
            return getPresenceSessionsPromise(userId, pageOfSessions.pagination.cursor)
        } else {
            return Promise.resolve(sessionsCounter)
        }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new UsersConnector(config)

if (process.argv.length < 3) {
    console.log("Invalid number of parameters... missing user ID")
    process.exit(1)
} else {
    userId = process.argv[2];
}

getPresenceSessionsPromise(userId, null)
    .then(totalSessions => console.log(sprintf("\nUser %s has %d presence sessions", userId, totalSessions)))
// ----------------------------------------------------------------------------

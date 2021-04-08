// ----------------------------------------------------------------------------
// GET USER PRESENCE
// ----------------------------------------------------------------------------
// This sample code retrieves the presence status of one user of 
// your organization.
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
if (process.argv.length < 3) {
  console.log("Invalid number of parameters... missing user ID")
  process.exit(1)
} else {
  userId = process.argv[2];
}

connector.getUserPresencePromise(userId)
  .catch(err => HttpErrorHandler.bailOut(err, "presence_read"))
  .then(data => console.log(JSON.stringify(data, null, 2)))
// ----------------------------------------------------------------------------

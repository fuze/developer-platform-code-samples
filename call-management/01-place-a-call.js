// ----------------------------------------------------------------------------
// PLACE A CALL SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to start a phone call for any user within your
// organization. Both external numbers and internal extension numbers are
// accepted.

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const CallManagementConnector = require('../connectors/CallManagementConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new CallManagementConnector(config)

if (process.argv.length < 4) {
  console.log("Invalid number of parameters...\nParameters: 'number' 'userId' 'sipDevice'\n")
  console.log("'number'     the number you wish to call (external or internal to your org)")
  console.log("'userId'     id of the user placing the call")
  console.log("'sipDevice'  optional sip device where your user will take the call\n")
} else {
  number = process.argv[2];
  userId = process.argv[3];
  if (process.argv.length > 4) {
    sipDevice = process.argv[4];
  } else {
      sipDevice = null
  }

  console.log("Going to place a call to phone number " + number + " for user " + userId)

  connector.startCallPromise(userId, number, sipDevice)
    .catch(err => HttpErrorHandler.bailOut(err, "calls_manage"))
    .then(body => {
        var msg = body.msg;
        console.log("API response: " + msg);
    })
}
// ----------------------------------------------------------------------------

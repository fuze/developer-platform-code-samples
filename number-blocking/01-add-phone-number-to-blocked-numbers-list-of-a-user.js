// ----------------------------------------------------------------------------
// BLOCK A PHONE NUMBER SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to add a phone number to one user of your 
// organization's number blocking list. 
// The phone number should not be currently in the user's number blocking list.

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
const config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const NumberBlockingConnector = require('../connectors/NumberBlockingConnector')
const Console = require('../utils/Console')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
const connector = new NumberBlockingConnector(config)

console.log("Add a phone number to the number blocking list of a user within your organization\n")
let userId = Console.getString("User ID")
let phoneNumber = Console.getString("Phone number (E.164 only)")
let direction = Console.getArrayFromCSVString("Blocking direction (INBOUND, OUTBOUND or both)", false)

console.log("Adding phone number " + phoneNumber + " to user " + userId + "'s number blocking list with blocked directions " + direction)

connector.addBlockedNumber(userId, phoneNumber, direction)
    .then(
        () => {
            console.log("Done")
        },
        err => {
            HttpErrorHandler.bailOut(err, "blocked_numbers_manage")
        }
    )
// ----------------------------------------------------------------------------

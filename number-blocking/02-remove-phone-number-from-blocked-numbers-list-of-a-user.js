// ----------------------------------------------------------------------------
// DELETE A PHONE NUMBER FROM THE NUMBER BLOCKING LIST SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code lets you remove a phone number from one user of your 
// organization's number blocking list. 
// The phone number should be in the user's number blocking list or a 404 will
// be returned.

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

console.log("Delete a phone number from the number blocking list of a user within your organization\n")
let userId = Console.getString("User ID")
let phoneNumber = Console.getString("Phone number (E.164 only)")

console.log("Removing phone number " + phoneNumber + " from user " + userId + "'s number blocking list")

connector.deleteBlockedNumber(userId, phoneNumber)
    .then(
        () => {
            console.log("Done")
        },
        err => {
            HttpErrorHandler.bailOut(err, "blocked_numbers_manage")
        }
    )
// ----------------------------------------------------------------------------

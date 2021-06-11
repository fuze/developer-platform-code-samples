// ----------------------------------------------------------------------------
// DELETE ALL PHONE NUMBERS FROM THE NUMBER BLOCKING LIST SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code lets you remove all phone numbers from one user of your 
// organization's number blocking list. 

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

console.log("Delete all phone numbers from the number blocking list of a user within your organization\n")
let userId = Console.getString("User ID")

console.log("Clearing the number blocking list for user " + userId)

connector.deleteAllBlockedNumber(userId)
    .then(
        body => {
            console.log("Previously blocked number were:\n" + JSON.stringify(body.data, null, 2))
        },
        err => {
            HttpErrorHandler.bailOut(err, "blocked_numbers_manage")
        }
    )
// ----------------------------------------------------------------------------

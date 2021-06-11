// ----------------------------------------------------------------------------
// GET ALL BLOCKED NUMBERS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code will list all currently blocked phone numbers for a user
// within your organization.

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
const config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const NumberBlockingConnector = require('../connectors/NumberBlockingConnector.js')
const Console = require('../utils/Console')
const HttpErrorHandler = require('../utils/Errors.js')

const connector = new NumberBlockingConnector(config)
let pageCounter = 0;
let nbrBlockedNumbers = 0;

// ----------------------------------------------------------------------------
// Recursively get pages of blocked numbers from the API.
// This function returns a promise with the total number of blocked numbers.
// ----------------------------------------------------------------------------
function getAllNumbersPromise(userId, cursor) {
  return connector.getAllNumbersPromise(userId, cursor)
    .catch(err => HttpErrorHandler.bailOut(err, "blocked_numbers_read"))
    .then(body => {
      console.log("\nPage " + (++pageCounter) + " with " + body.data.length + " items");

      body.data.forEach(blockedNumber => {
        console.log(" phone number " + blockedNumber.phoneNumber + " blocked direction " + blockedNumber.direction)
      });

      nbrBlockedNumbers += body.data.length

      if (body.pagination.cursor != null) {
        return getAllNumbersPromise(userId, body.pagination.cursor)
      } else {
        return Promise.resolve(nbrBlockedNumbers)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
console.log("List all blocked numbers\n")
let userId = Console.getString("User ID")

getAllNumbersPromise(userId, null)
  .then(totalBlockedNumbersFound => console.log("Found a total of " + totalBlockedNumbersFound + " blocked numbers for user " + userId))
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// DEPROVISION USER SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code is interactive.
// It will terminate (delete) a user of your organization and optionally
// forward the terminated user's extension to another one, usually the user's
// manager

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const UsersConnector = require('../connectors/UsersConnector.js')
const JobsConnector = require('../connectors/JobsConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')
const Console = require('../utils/Console.js')

var usersConnector = new UsersConnector(config)
var jobsConnector = new JobsConnector(config)

// ----------------------------------------------------------------------------
// Get forwarding details
// ----------------------------------------------------------------------------
function getExtensionForwardDetails() {
    var forwardDetails

    do {
        forwardDetails = {}

        forwardDetails.managerUserId = Console.getPositiveNumber("Manager user ID")
        forwardDetails.forwardingSku = Console.getString("Forwarding SKU")

        if (forwardDetails.managerUserId == null || forwardDetails.forwardingSku == null) {
            console.log("Invalid values, both manager user ID and forwarding SKU must be present")
        }
    } while (forwardDetails.managerUserId == null || forwardDetails.forwardingSku == null)

    return forwardDetails
}

function showJobDetails(jobId) {
    jobsConnector.getJobDetailsPromise(jobId)
        .catch(err => HttpErrorHandler.bailOut(err, "jobs_read"))
        .then(responseData => {
            console.log(JSON.stringify(responseData, null, 2))
        })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

if (process.argv.length > 2) {
    console.log("Too many parameters...\nNo parameters are required, this is an interactive code sample\n")
} else {
    var userId = null;
    var managerUserId = null;
    var forwardingSku = null;

    userId = Console.getPositiveNumber("User ID");
    if (Console.getBoolean("Forward this user's extension to another one")) {
        var forwardDetails = getExtensionForwardDetails()
        managerUserId = forwardDetails.managerUserId
        forwardingSku = forwardDetails.forwardingSku
    }

    usersConnector.deprovisionUserPromise(userId, managerUserId, forwardingSku)
        .catch(err => HttpErrorHandler.bailOut(err, "deprovision_user"))
        .then(responseData => {
        console.log("User " + userId + " is going to be deprovisioned by Job ID " + responseData.job)
            if (Console.getBoolean("Show details of job " + responseData.job)) {
                showJobDetails(responseData.job)
            }
        })
}
// ----------------------------------------------------------------------------

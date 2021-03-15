// ----------------------------------------------------------------------------
// SHOW JOB DETAILS SAMPLE CODE
// ----------------------------------------------------------------------------
// Shows the details about an asynchronous job running on the Developer API

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const JobsConnector = require('../connectors/JobsConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new JobsConnector(config)

if (process.argv.length < 3) {
    console.log("Invalid number of parameters...\nParameters: 'jobId'\n")
    console.log("'jobId'     id of the job (a numeric value)")
} else {
    jobId = process.argv[2];

    console.log("Show job " + jobId)

    connector.getJobDetailsPromise(jobId)
        .catch(err => HttpErrorHandler.bailOut(err, "jobs_read"))
        .then(responseData => {
            console.log(JSON.stringify(responseData, null, 2))
        })
}
// ----------------------------------------------------------------------------

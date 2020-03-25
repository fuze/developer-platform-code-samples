// ----------------------------------------------------------------------------
// GET ALL DEPARTMENTS OF YOUR ORGANIZATION
// ----------------------------------------------------------------------------
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (OrganizationsConnector (httplease) and sprintf-js)
// ----------------------------------------------------------------------------
const sprintf = require('sprintf-js').sprintf
const httplease = require('httplease')
const OrganizationsConnector = require('../connectors/OrganizationsConnector.js')

// ----------------------------------------------------------------------------
// Display them
// ----------------------------------------------------------------------------
function showOrganizations(listOfOrganizations) {
    console.log(sprintf("%-6s | %-20s", "Id", "Name"))
    console.log("------ | -------------------------------")
    listOfOrganizations.forEach(d => console.log(sprintf("%-6s | %-20s", d.id, d.name)))
}

// ----------------------------------------------------------------------------
// Very basic error handler
// ----------------------------------------------------------------------------
function bailOut(err) {
    if (err instanceof httplease.errors.UnexpectedHttpResponseCodeError) {
        console.log(err.response.statusCode);
        console.log(err.response.headers);
        console.log(err.response.body);
    } else {
        console.log(err.message)
    }
    process.exit(1);
}

// ----------------------------------------------------------------------------
// Recursively get organizations from the API, one page at a time.
// This function returns a promise with a list of organizations.
// ----------------------------------------------------------------------------
var allOrganizations = new Set();
var pageNumber = 0;
function getPageOfOrganizationsPromise(cursor) {
    return connector.getOrganizationsPromise(cursor)
        .catch(bailOut)
        .then(pageOfOrganizations => {
            console.log("\nPage " + ++pageNumber + " with " + pageOfOrganizations.data.length + " organizations")
            pageOfOrganizations.data.forEach(l => allOrganizations.add(l))

            if (pageOfOrganizations.pagination.cursor != null) {
                return getPageOfOrganizationsPromise(pageOfOrganizations.pagination.cursor)
            } else {
                return Promise.resolve(allOrganizations)
            }
        })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new OrganizationsConnector(config)
getPageOfOrganizationsPromise(null)
    .then(allLocations => {
        console.log("\nYour have access to " + allLocations.size + " organizations")
        showOrganizations(allLocations)
    })
// ----------------------------------------------------------------------------

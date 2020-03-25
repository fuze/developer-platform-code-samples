// ----------------------------------------------------------------------------
// GET ALL DEPARTMENTS OF YOUR ORGANIZATION
// ----------------------------------------------------------------------------
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (DepartmentsConnector (httplease) and sprintf-js)
// ----------------------------------------------------------------------------
const sprintf = require('sprintf-js').sprintf
const httplease = require('httplease')
const DepartmentsConnector = require('../connectors/DepartmentsConnector.js')

// ----------------------------------------------------------------------------
// Display them
// ----------------------------------------------------------------------------
function showDepartments(listOfDepartments) {
    console.log(sprintf("%-6s | %-20s", "Id", "Name"))
    console.log("------ | -------------------------------")
    listOfDepartments.forEach(d => console.log(sprintf("%-6d | %-20s", d.departmentId, d.name)))
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
// Recursively get departments from the API, one page at a time.
// This function returns a promise with a list of departments.
// ----------------------------------------------------------------------------
var allDepartments = new Set();
var pageNumber = 0;
function getPageOfDepartmentsPromise(cursor) {
    return connector.getDepartmentsPromise(cursor)
        .catch(bailOut)
        .then(pageOfDepartments => {
            console.log("\nPage " + ++pageNumber + " with " + pageOfDepartments.data.length + " departments")
            pageOfDepartments.data.forEach(l => allDepartments.add(l))

            if (pageOfDepartments.pagination.cursor != null) {
                return getPageOfDepartmentsPromise(pageOfDepartments.pagination.cursor)
            } else {
                return Promise.resolve(allDepartments)
            }
        })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new DepartmentsConnector(config)
getPageOfDepartmentsPromise(null)
    .then(allLocations => {
        console.log("\nYour organization has " + allLocations.size + " departments")
        showDepartments(allLocations)
    })
// ----------------------------------------------------------------------------

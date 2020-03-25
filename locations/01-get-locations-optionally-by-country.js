// ----------------------------------------------------------------------------
// GET ALL LOCATIONS OF YOUR ORGANIZATION (optionally filtering by country)
// ----------------------------------------------------------------------------
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (LocationsConnector (httplease) and node-stringbuilder)
// ----------------------------------------------------------------------------
const httplease = require('httplease')
const LocationsConnector = require('../connectors/LocationsConnector.js')

// ----------------------------------------------------------------------------
// Filter by country
// ----------------------------------------------------------------------------
function filterByCountry(listOfLocations, optionalCountry) {
    var filteredLocations;

    if (optionalCountry != null) {
        filteredLocations = new Set()
        listOfLocations.forEach(l => {
            if (l.countryCode != null && l.countryCode.includes(optionalCountry)) {
                filteredLocations.add(l)
            }
        })
    } else {
        filteredLocations = listOfLocations
    }

    return filteredLocations;
}

// ----------------------------------------------------------------------------
// Display them
// ----------------------------------------------------------------------------
function showLocations(listOfLocations, optionalCountry) {
    var subsetOfLocations = filterByCountry(listOfLocations, optionalCountry)

    if (optionalCountry != null) {
        console.log("Filtering by country code " + optionalCountry + " returns only " + subsetOfLocations.size + " locations")
    }
    subsetOfLocations.forEach(l => console.log(l.name + ', ' + l.countryCode))
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
// Recursively get locations from the API, one page at a time.
// This function returns a promise with a list of locations.
// ----------------------------------------------------------------------------
var allLocations = new Set();
var pageNumber = 0;
function getPageOfLocationsPromise(cursor) {
    return connector.getLocationsPromise(cursor)
        .catch(bailOut)
        .then(pageOfLocations => {
            console.log("\nPage " + ++pageNumber + " with " + pageOfLocations.data.length + " locations")
            pageOfLocations.data.forEach(l => allLocations.add(l))

            if (pageOfLocations.pagination.cursor != null) {
                return getPageOfLocationsPromise(pageOfLocations.pagination.cursor)
            } else {
                return Promise.resolve(allLocations)
            }
        })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var countryCode;

if (process.argv.length > 2) {
    countryCode = process.argv[2];
} else {
    countryCode = null;
}

var connector = new LocationsConnector(config)
getPageOfLocationsPromise(null)
    .then(allLocations => {
        console.log("\nYour organization has " + allLocations.size + " locations")
        showLocations(allLocations, countryCode)
    })
// ----------------------------------------------------------------------------

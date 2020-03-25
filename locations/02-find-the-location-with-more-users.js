// ----------------------------------------------------------------------------
// FIND THE LOCATION OF YOUR ORGANIZATION WITH MORE USERS
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
const UsersConnector = require('../connectors/UsersConnector.js')
const LocationsConnector = require('../connectors/LocationsConnector.js')

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

var mapOfUserCountPerLocation = new Map()
function addToMapOfLocations(users) {
    users.forEach(user => {
        if (user.locationId == null) {
            console.log("  > ignoring user " + user.userName + " without location")
        } else {
            if (mapOfUserCountPerLocation.has(user.locationId)) {
                var count = mapOfUserCountPerLocation.get(user.locationId)
                mapOfUserCountPerLocation.set(user.locationId, ++count)
            } else {
                mapOfUserCountPerLocation.set(user.locationId, 1)
            }
        }
    })
}

// ----------------------------------------------------------------------------
// Recursively get locations from the API, one page at a time.
// This function returns a promise with a list of locations.
// ----------------------------------------------------------------------------
var pageNumber = 0;
function buildMapOfUserCountPerLocationPromise(cursor) {
    return usersConnector.getUsersPromise(cursor)
        .catch(bailOut)
        .then(pageOfUsers => {
            console.log("Processing page " + ++pageNumber + " with " + pageOfUsers.data.length + " users")
            addToMapOfLocations(pageOfUsers.data)

            if (pageOfUsers.pagination.cursor != null) {
                return buildMapOfUserCountPerLocationPromise(pageOfUsers.pagination.cursor)
            } else {
                return Promise.resolve(mapOfUserCountPerLocation)
            }
        })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var usersConnector = new UsersConnector(config)
var locationsConnector = new LocationsConnector(config)
buildMapOfUserCountPerLocationPromise(null)
    .then(mapOfUsersInLocations => {
        var sortedMap = new Map([...mapOfUsersInLocations.entries()].sort((a, b) => b[1] - a[1]));
        if (sortedMap.size > 0) {
            var locationId = sortedMap.entries().next().value[0];
            console.log("Top locationId: " + locationId)
            return locationsConnector.getLocationPromise(locationId).catch(bailOut);
        } else {
            console.log("Apparently there are no locations for your organization")
            return Promise.resolve(null)
        }
    })
    .then(location => {
        if (location != null) {
            console.log("Top location name " + location.name)
        }
    })
// ----------------------------------------------------------------------------

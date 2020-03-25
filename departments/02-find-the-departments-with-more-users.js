// ----------------------------------------------------------------------------
// FIND THE DEPARTMENT OF YOUR ORGANIZATION WITH MORE USERS
// ----------------------------------------------------------------------------
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (DepartmentsConnector (httplease) and node-stringbuilder)
// ----------------------------------------------------------------------------
const httplease = require('httplease')
const UsersConnector = require('../connectors/UsersConnector.js')
const DepartmentsConnector = require('../connectors/DepartmentsConnector.js')

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
function addToMapOfDepartments(users) {
    users.forEach(user => {
        if (user.departmentId == null) {
            console.log("  > ignoring user " + user.userName + " without department")
        } else {
            if (mapOfUserCountPerLocation.has(user.departmentId)) {
                var count = mapOfUserCountPerLocation.get(user.departmentId)
                mapOfUserCountPerLocation.set(user.departmentId, ++count)
            } else {
                mapOfUserCountPerLocation.set(user.departmentId, 1)
            }
        }
    })
}

// ----------------------------------------------------------------------------
// Recursively get departments from the API, one page at a time.
// This function returns a promise with a list of departments.
// ----------------------------------------------------------------------------
var pageNumber = 0;
function buildMapOfUserCountPerLocationPromise(cursor) {
    return usersConnector.getUsersPromise(cursor)
        .catch(bailOut)
        .then(pageOfUsers => {
            console.log("Processing page " + ++pageNumber + " with " + pageOfUsers.data.length + " users")
            addToMapOfDepartments(pageOfUsers.data)

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
var departmentsConnector = new DepartmentsConnector(config)
buildMapOfUserCountPerLocationPromise(null)
    .then(mapOfUsersInDepartments => {
        var sortedMap = new Map([...mapOfUsersInDepartments.entries()].sort((a, b) => b[1] - a[1]));
        if (sortedMap.size > 0) {
            var departmentId = sortedMap.entries().next().value[0];
            console.log("Top departmentId: " + departmentId)
            return departmentsConnector.getLocationPromise(departmentId).catch(bailOut);
        } else {
            console.log("Apparently there are no departments for your organization")
            return Promise.resolve(null)
        }
    })
    .then(department => {
        if (department != null) {
            console.log("Top department name " + department.name)
        }
    })
// ----------------------------------------------------------------------------

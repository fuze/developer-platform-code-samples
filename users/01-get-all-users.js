// ----------------------------------------------------------------------------
// GET ALL USERS OF YOUR ORGANIZATION
// ----------------------------------------------------------------------------
// This sample code retrieves all users of your organization.
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (UsersConnector (httplease) and node-stringbuilder)
// ----------------------------------------------------------------------------
const httplease = require('httplease')
const StringBuilder = require('node-stringbuilder')
const UsersConnector = require('../connectors/UsersConnector.js')

// ----------------------------------------------------------------------------
// Logs all the usernames
// ----------------------------------------------------------------------------
function logUserNamesInOneLine(usersList) {
  var listOfNames = new StringBuilder();
  usersList.forEach(u => listOfNames.append(u.userName).append(', '))
  console.log(' usernames: ' + listOfNames.toString())
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
// Recursively get users from the API, one page at a time.
// This function returns a promise.
// ----------------------------------------------------------------------------
var allUserIdsSet = new Set();
var pageNumber = 0;
function getUserIdsOfOrganizationPromise(cursor) {
  return connector.getUsersPromise(cursor)
  .catch(bailOut)
  .then(pageOfUsers => {
      console.log("\nPage " + ++pageNumber + " with " + pageOfUsers.data.length + " users")
      pageOfUsers.data.forEach(u => allUserIdsSet.add(u))
      logUserNamesInOneLine(pageOfUsers.data);

      if (pageOfUsers.pagination.cursor != null) {
        return getUserIdsOfOrganizationPromise(pageOfUsers.pagination.cursor)
      } else {
        return Promise.resolve(allUserIdsSet)
      }
  })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new UsersConnector(config)
getUserIdsOfOrganizationPromise(null)
  .then(allUserIdsOfOrgSet => console.log("\nYour organization has " + allUserIdsOfOrgSet.size + " users"))
// ----------------------------------------------------------------------------

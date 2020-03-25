// ----------------------------------------------------------------------------
// GET ALL USERS OF YOUR ORGANIZATION WITH CALL RECORDINGS MADE SINCE YESTERDAY
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
//   UsersConnector
//   CallRecordingsConnector
//   httplease (only for error logging)
// ----------------------------------------------------------------------------
const httplease = require('httplease')
const UsersConnector = require('../connectors/UsersConnector.js')
const CallRecordingsConnector = require('../connectors/CallRecordingsConnector.js')

// ----------------------------------------------------------------------------
// Connectors
// ----------------------------------------------------------------------------
var callRecConnector = new CallRecordingsConnector(config)
var usersConnector = new UsersConnector(config)

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
// Filter: ignore call recordings made before "notBefore"
// ----------------------------------------------------------------------------
function filterOnlyThoseAfterDate(pageOfCallRecs, notBefore) {
  var filteredCallRecs = [];

  pageOfCallRecs.data.forEach(function(callRec) {
    var callDate = new Date(callRec.startedAt);
    if (callDate > notBefore) {
      filteredCallRecs.push(callRec);
    }
  });

  return filteredCallRecs;
}

// ----------------------------------------------------------------------------
// Get call recordings from the API and run the filter to keep those made since
// yesterday. This function returns a promise.
// ----------------------------------------------------------------------------
var callRecsToKeep = new Set();
var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1); // take 1 day from the date

function getCallRecordingsSinceYesterdayPromise(cursor) {
  return callRecConnector.getAllCallRecsPromise(cursor)
    .catch(bailOut)
    .then(pageOfCallRecordings => {
      console.log("Got a page of " + pageOfCallRecordings.data.length + " call recordings")
      var filteredCallRecsFromPage = filterOnlyThoseAfterDate(pageOfCallRecordings, yesterday)

      filteredCallRecsFromPage.forEach(item => callRecsToKeep.add(item))
      console.log("Filtering returned " + filteredCallRecsFromPage.length + " and we have a total of " + callRecsToKeep.size + " call recordings")
      
      var nextCursor = pageOfCallRecordings.pagination.cursor;
      if (nextCursor != null && filteredCallRecsFromPage.length != 0) {
        console.log("Let's fetch another page from the API")
        return getCallRecordingsSinceYesterdayPromise(nextCursor);
      } else {
        console.log("And there are no more call recordings since yesterday, the total is " + callRecsToKeep.size)
        return Promise.resolve(callRecsToKeep)
      }
    })
}
// ----------------------------------------------------------------------------
// Given a collection of call recordings, extract the distinct userIds.
// This function returns a promise.
// ----------------------------------------------------------------------------
function getDistinctUsersFromCallRecordings(callRecordings) {
  return new Promise(function(resolve, reject) {
    var allUserIds = new Set();
    callRecordings.forEach(cr => allUserIds.add(cr.userId))
    console.log("These " + callRecordings.size + " call recordings were made by " + allUserIds.size + " users in total")
    resolve(allUserIds);
  })
}
// ----------------------------------------------------------------------------
// Get users from the API to convert the userId to the username.
// This function returns a promise.
// ----------------------------------------------------------------------------
function getUserNamesByUserIdsPromise(userIdSet) {
  var userNamesArray = []
  var userIdsArray = Array.from(userIdSet)
  return userIdsArray.reduce((chain, userId) => {
    return chain.then(userNamedList => usersConnector.getUserPromise(userId)
      .catch(bailOut)
      .then(userResponse => {
        userNamedList.push(userResponse.userName)
        return userNamesArray
      }))
  }, Promise.resolve(userNamesArray))
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
getCallRecordingsSinceYesterdayPromise(null)
  .then(callRecordingsSet => getDistinctUsersFromCallRecordings(callRecordingsSet))
  .then(userIdsSet => getUserNamesByUserIdsPromise(userIdsSet))
  .then(userNamesArray => userNamesArray.forEach(u => console.log(" user: " + u)))
// ----------------------------------------------------------------------------

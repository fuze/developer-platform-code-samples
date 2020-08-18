// ----------------------------------------------------------------------------
// GET ALL CALL HISTORY SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code retrieves all call history, ie, all calls made by your
// organization.

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const StringBuilder = require('node-stringbuilder')
const CallsConnector = require('../connectors/CallsConnector')
const HttpErrorHandler = require('../utils/Errors.js')

var connector = new CallsConnector(config)
var pageCounter = 0;
var callLinkedIds = []

// ----------------------------------------------------------------------------
// log call linkedIds on a page of calls
// ----------------------------------------------------------------------------
function logCallsLinkedId(callsList) {
  var listOfCallIds = new StringBuilder();
  callsList.forEach(function (c) {
    listOfCallIds.append(c.linkedId).append(', ');
  })
  console.log(' linkedIds: ' + listOfCallIds.toString())
}

// ----------------------------------------------------------------------------
// add all linkedIds from a page of calls to the array
// ----------------------------------------------------------------------------
function keepLinkedIds(callsList) {
  callsList.forEach(function (c) {
    callLinkedIds.push(c.linkedId)
  })
}

// ----------------------------------------------------------------------------
// Recursively get pages of calls from the API.
// This function returns a promise with all the call IDs.
// ----------------------------------------------------------------------------
function getTotalAmountOfCallsPromise(cursor) {
  return connector.getAllCallsPromise(cursor)
    .catch(err => HttpErrorHandler.bailOut(err, "calls_read"))
    .then(pageOfCalls => {
      console.log("\nPage " + (++pageCounter) + " with " + pageOfCalls.data.length + " calls");
      logCallsLinkedId(pageOfCalls.data)
      keepLinkedIds(pageOfCalls.data)

      if (pageOfCalls.pagination.cursor != null) {
        return getTotalAmountOfCallsPromise(pageOfCalls.pagination.cursor)
      } else {
        return Promise.resolve(callLinkedIds)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
getTotalAmountOfCallsPromise(null)
  .then(allCallIds => console.log("Found a total of " + allCallIds.length + " calls"))
// ----------------------------------------------------------------------------

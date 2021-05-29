// ----------------------------------------------------------------------------
// CREATE WEBHOOK SUBSCRIPTIONS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to create subscriptions on an existing webhook

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
const config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const CallEventsConnector = require('../connectors/CallEventsConnector');
const Console = require('../utils/Console');
const HttpErrorHandler = require('../utils/Errors.js')

function getUserIds() {
  let userIds = [];
  let userId = null;
  console.log("Type the user IDs from wish to subscribe to their notifications\nDo not mix numeric user IDs with the star (*)\n")

  do {
    userId = Console.getString("Type user ID (leave empty when done)")
    userId = userId.trim()
    if (userId != "") {
      userIds.push(userId)
    }
  } while (userId != "" && userId != "*");

  return userIds;
}

function chooseEventTypes() {
  console.log("Please select the events to be notified upon. ")
  console.log("callConnect,ring,dial,dialConnected,hangup,onHoldStart,onHoldStop,recordingStart,recordingStop,recordingPauseStart,recordingPauseStop,onHoldHangup,ownershipChange,callStart,convStart,convEnd,callEnd,callMonitorStart,callMonitorStop,callMonitorStatusChange")

  let events = []
  let eventName = null
  do {
    eventName = Console.getString("Event (leave empty when done)")
    eventName = eventName.trim();
    if (eventName != "") {
      events.push(eventName)
    }
  } while (eventName != "");

  return events
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
const connector = new CallEventsConnector(config)

console.log("Create a call events subscription\n")
let webhookId = Console.getPositiveNumber("Webhook ID")
let userIds = getUserIds();
let eventTypes = chooseEventTypes()
let expirationDate = Console.getDate("Type the expiration date (or leave empty for the default)");

console.log("Going to create add " + userIds.length + " subscriptions to webhook " + webhookId)

connector.createWebhookSubscriptionsPromise(webhookId, userIds, eventTypes, expirationDate)
  .catch(err => HttpErrorHandler.bailOut(err, "presence_webhooks_manage"))
  .then(body => {
    let subscriptions = body.data;
    console.log("Created " + subscriptions.length + " subscriptions:\n" + JSON.stringify(subscriptions));
  })
// ----------------------------------------------------------------------------

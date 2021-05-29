// ----------------------------------------------------------------------------
// GET ALL WEBHOOK SUBSCRIPTIONS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample lists all subscriptions on a webhook of your organization

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
const config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const CallEventsConnector = require('../connectors/CallEventsConnector')
const Console = require('../utils/Console')
const HttpErrorHandler = require('../utils/Errors.js')

const connector = new CallEventsConnector(config)
let pageCounter = 0;
let subsCounter = 0;

// ----------------------------------------------------------------------------
// Recursively get pages of webhooks from the API.
// This function returns a promise with the total number of webhooks.
// ----------------------------------------------------------------------------
function getAllSubscriptionsPromise(webhookId, cursor) {
  return connector.getWebhookSubscriptionsPromise(webhookId, cursor)
    .catch(err => HttpErrorHandler.bailOut(err, "calls_webhooks_read"))
    .then(body => {
      console.log("\nPage " + (++pageCounter) + " with " + body.data.length + " items");

      body.data.forEach(subscription => {
        console.log(" subscriptionId: " + subscription.subscriptionId + ", userId: " + subscription.userId + ", expires: " + subscription.expires)
      });

      subsCounter += body.data.length

      if (body.pagination.cursor != null) {
        return getAllSubscriptionsPromise(webhookId, body.pagination.cursor)
      } else {
        return Promise.resolve(subsCounter)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
console.log("Show all subscriptions of a call events webhook\n")
let webhookId = Console.getPositiveNumber("Webhook ID")

getAllSubscriptionsPromise(webhookId, null)
  .then(totalSubsFound => console.log("Found a total of " + totalSubsFound + " subscriptions on webhook " + webhookId))
// ----------------------------------------------------------------------------

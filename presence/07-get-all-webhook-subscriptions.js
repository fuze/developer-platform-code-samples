// ----------------------------------------------------------------------------
// GET ALL WEBHOOK SUBSCRIPTIONS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample lists all subscriptions on a webhook of your organization

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const PresenceConnector = require('../connectors/PresenceConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

var connector = new PresenceConnector(config)
var pageCounter = 0;
var subsCounter = 0;

// ----------------------------------------------------------------------------
// Recursively get pages of webhooks from the API.
// This function returns a promise with the total number of webhooks.
// ----------------------------------------------------------------------------
function getAllSubscriptionsPromise(webhookId, cursor) {
  return connector.getWebhookSubscriptionsPromise(webhookId, cursor)
    .catch(err => HttpErrorHandler.bailOut(err, "presence_webhooks_read"))
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
if (process.argv.length < 3) {
  console.log("Invalid number of parameters...\nParameters: webhookId\n")
  console.log("'webhookId'      webhook numeric identifier")
} else {
  webhookId = process.argv[2];

  getAllSubscriptionsPromise(webhookId, null)
    .then(totalSubsFound => console.log("Found a total of " + totalSubsFound + " subscriptions on webhook " + webhookId))
}
// ----------------------------------------------------------------------------

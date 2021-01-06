// ----------------------------------------------------------------------------
// GET ONE WEBHOOK SUBSCRIPTION SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to get one subscription on an existing webhook
// by providing its numeric id or providing the userId in the subscription

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const PresenceConnector = require('../connectors/PresenceConnector')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new PresenceConnector(config)

if (process.argv.length < 4) {
  console.log("Invalid number of parameters...\nParameters: webhookId subId\n")
  console.log("'webhookId'      webhook numeric identifier")
  console.log("'subId'          can be the notification id or the user id if you prefix it with 'userId:' see below")
  console.log("                 - '123456787654321' if you have the subscription id")
  console.log("                 - 'userId:876543212345678' if you have the user id\n")
} else {
  webhookId = process.argv[2];
  subscriptionId = process.argv[3];

  connector.getWebhookSubscriptionByIdPromise(webhookId, subscriptionId)
    .catch(err => HttpErrorHandler.bailOut(err, "presence_webhooks_read"))
    .then(body => {
        var subscription = body.data;
        console.log("Subscription: " + JSON.stringify(subscription));
    })
}
// ----------------------------------------------------------------------------

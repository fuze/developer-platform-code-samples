// ----------------------------------------------------------------------------
// CREATE WEBHOOK SUBSCRIPTIONS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to create subscriptions on an existing webhook

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const PresenceConnector = require('../connectors/PresenceConnector')
const HttpErrorHandler = require('../utils/Errors.js')

function getUserIds(argv) {
  var userIds = [];
  var i;
  
  for (i = 4; i < argv.length; i++) {
    userIds.push(argv[i])
  }

  return userIds;
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new PresenceConnector(config)

if (process.argv.length < 5) {
  console.log("Invalid number of parameters...\nParameters: webhookId expirationDate userId [userId] ... [userId]\n")
  console.log("'webhookId'      webhook numeric identifier")
  console.log("'expirationDate' the date and time at which the subscriptions will expire in ISO8601 format, eg, 2030-12-31T23:59:59Z")
  console.log("'userId'         list of userIds to subscribe for presence events, or * if you want to subscribe to all users\n")
  console.log("Don't mix numeric userIds with *. If subscribing *, all previously existing subscriptions on the webhook will be revoked")
} else {
  webhookId = process.argv[2];
  expirationDate = process.argv[3];
  userIds = getUserIds(process.argv);

  console.log("Going to create add " + userIds.length + " subscriptions to webhook " + webhookId)

  connector.createWebhookSubscriptionsPromise(webhookId, userIds, expirationDate)
    .catch(err => HttpErrorHandler.bailOut(err, "presence_webhooks_manage"))
    .then(body => {
        var subscriptions = body.data;
        console.log("Created " + subscriptions.length + " subscriptions:\n" + JSON.stringify(subscriptions));
    })
}
// ----------------------------------------------------------------------------

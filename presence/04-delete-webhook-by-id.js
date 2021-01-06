// ----------------------------------------------------------------------------
// DELETE ONE WEBHOOK SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to delete one webhook
// When deleting a webhook, all subscriptions it contains will be deleted as
// well

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

if (process.argv.length < 3) {
  console.log("Invalid number of parameters...\nParameters: webhookId\n")
  console.log("'webhookId'      webhook numeric identifier")
} else {
  webhookId = process.argv[2];

  connector.deleteWebhookByIdPromise(webhookId)
    .catch(err => HttpErrorHandler.bailOut(err, "presence_webhooks_manage"))
    .then(body => {
        var webhook = body.data;
        console.log("Deleted webhook: " + JSON.stringify(webhook));
    })
}
// ----------------------------------------------------------------------------

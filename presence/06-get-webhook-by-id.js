// ----------------------------------------------------------------------------
// GET ONE WEBHOOK SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to get one webhook

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

  connector.getWebhookByIdPromise(webhookId)
    .catch(err => HttpErrorHandler.bailOut(err, "presence_webhooks_read"))
    .then(body => {
        var webhook = body.data;
        console.log("Webhook: " + JSON.stringify(webhook));
    })
}
// ----------------------------------------------------------------------------

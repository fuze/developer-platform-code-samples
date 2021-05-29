// ----------------------------------------------------------------------------
// GET ONE WEBHOOK SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to display the contents of a webhook

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

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
const connector = new CallEventsConnector(config)

console.log("Show details of a call events webhook\n")
let webhookId = Console.getPositiveNumber("Webhook ID")

connector.getWebhookByIdPromise(webhookId)
  .catch(err => HttpErrorHandler.bailOut(err, "calls_webhooks_read"))
  .then(body => {
    let webhook = body.data;
    console.log("Webhook: " + JSON.stringify(webhook));
  })
// ----------------------------------------------------------------------------

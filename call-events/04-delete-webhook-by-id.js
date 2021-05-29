// ----------------------------------------------------------------------------
// DELETE ONE WEBHOOK SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to delete a webhook
// When deleting a webhook, all subscriptions it contains will be deleted as
// well

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

console.log("Delete a call events webhook\n")
let webhookId = Console.getPositiveNumber("Webhook ID")

connector.deleteWebhookByIdPromise(webhookId)
  .catch(err => HttpErrorHandler.bailOut(err, "calls_webhooks_manage"))
  .then(body => {
    let webhook = body.data;
    console.log("Deleted webhook: " + JSON.stringify(webhook));
  })
// ----------------------------------------------------------------------------

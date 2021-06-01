// ----------------------------------------------------------------------------
// CREATE WEBHOOK SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to create a webhook that can be used to subscribe
// to call event notifications.

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

console.log("Create a call events webhook\n")
let label = Console.getString("Type an identifying label")

console.log("Type your webhook URL (if you just want to test receiving the events, open https://webhook.site/ and use the provided test URL)")
let url = Console.getString("URL")

let optionalToken = Console.getString("Type the authentication token Fuze needs to send to your URL (leave empty for none)")
if (optionalToken.trim() == "") {
  optionalToken = null;
}

console.log("Going to create a webhook with label " + label + " pointing to " + url)

connector.createWebhookPromise(label, url, optionalToken)
  .catch(err => HttpErrorHandler.bailOut(err, "calls_webhooks_manage"))
  .then(body => {
    let webhook = body.data;
    console.log("Created webhook with id " + webhook.id + ":\n" + JSON.stringify(webhook));
  })
// ----------------------------------------------------------------------------

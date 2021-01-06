// ----------------------------------------------------------------------------
// CREATE WEBHOOK SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to create a webhook that can be used to subscribe
// to presence notifications.

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
  console.log("Invalid number of parameters...\nParameters: 'label' 'url' ['urlBearerToken']\n")
  console.log("'label'          free range label, something that helps you identify the purpose of the webhook")
  console.log("'url'            where the notification will be delivered")
  console.log("'urlBearerToken' the token that we'll send on the request to 'url', optional\n")
  console.log("Don't forget to pass label and url inside single quotes")
} else {
  label = process.argv[2];
  url = process.argv[3];
  optionalToken = process.argv[4];

  console.log("Going to create a webhook with label " + label + " pointing to " + url)

  connector.createWebhookPromise(label, url, optionalToken)
    .catch(err => HttpErrorHandler.bailOut(err, "presence_webhooks_manage"))
    .then(body => {
        var webhook = body.data;
        console.log("Created webhook with id " + webhook.id + ":\n" + JSON.stringify(webhook));
    })
}
// ----------------------------------------------------------------------------

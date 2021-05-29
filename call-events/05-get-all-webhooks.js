// ----------------------------------------------------------------------------
// GET ALL WEBHOOKS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample lists all call event webhooks that currently exist on your 
// organization.

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
const config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const CallEventsConnector = require('../connectors/CallEventsConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

const connector = new CallEventsConnector(config)
let pageCounter = 0;
let nbrWebhooks = 0;

// ----------------------------------------------------------------------------
// Recursively get pages of webhooks from the API.
// This function returns a promise with the total number of webhooks.
// ----------------------------------------------------------------------------
function getAllWebhooksPromise(cursor) {
  return connector.getAllWebhooksPromise(cursor)
    .catch(err => HttpErrorHandler.bailOut(err, "calls_webhooks_read"))
    .then(body => {
      console.log("\nPage " + (++pageCounter) + " with " + body.data.length + " items");

      body.data.forEach(webhook => {
        console.log(" id " + webhook.id + ", " + webhook.subscriptions.length + " subscriptions and label: " + webhook.label)
      });

      nbrWebhooks += body.data.length

      if (body.pagination.cursor != null) {
        return getAllWebhooksPromise(body.pagination.cursor)
      } else {
        return Promise.resolve(nbrWebhooks)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
console.log("List all call events webhook\n")
getAllWebhooksPromise(null)
  .then(totalWebhooksFound => console.log("Found a total of " + totalWebhooksFound + " webhooks on your organization"))
// ----------------------------------------------------------------------------

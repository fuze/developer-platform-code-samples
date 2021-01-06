// ----------------------------------------------------------------------------
// GET ALL WEBHOOKS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample lists all webhooks that currently exist on your organization.

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
var nbrWebhooks = 0;

// ----------------------------------------------------------------------------
// Recursively get pages of webhooks from the API.
// This function returns a promise with the total number of webhooks.
// ----------------------------------------------------------------------------
function getAllWebhooksPromise(cursor) {
  return connector.getAllWebhooksPromise(cursor)
    .catch(err => HttpErrorHandler.bailOut(err, "presence_webhooks_read"))
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
getAllWebhooksPromise(null)
  .then(totalWebhooksFound => console.log("Found a total of " + totalWebhooksFound + " webhooks on your organization"))
// ----------------------------------------------------------------------------

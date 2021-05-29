// ----------------------------------------------------------------------------
// DELETE ONE WEBHOOK SUBSCRIPTION SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code shows how to delete a subscription on an existing webhook
// by providing its numeric id or providing the userId in the subscription

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
console.log("Delete a call events subscription")
let webhookId = Console.getPositiveNumber("Webhook ID")

console.log("You have two ways to choose which subscription to delete:")
console.log(" 123456787654321        : if you have the subscription id")
console.log(" userId:876543212345678 : if you have the user id\n")
let subscriptionId = Console.getPositiveNumberWithOptionalPrefix("Subscription ID", "userId:")

connector.deleteWebhookSubscriptionByIdPromise(webhookId, subscriptionId)
  .catch(err => HttpErrorHandler.bailOut(err, "calls_webhooks_manage"))
  .then(body => {
    let subscription = body.data;
    console.log("Deleted this subscription: " + JSON.stringify(subscription));
  })
// ----------------------------------------------------------------------------

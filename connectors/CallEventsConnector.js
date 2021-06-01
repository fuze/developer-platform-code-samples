const httplease = require("httplease");


class CallEventsConnector {
  constructor(config) {
     this.authToken = config.authToken;
     this.pageSize = 100;
     this.httpClient = httplease.builder()
         .withBaseUrl(config.fuzeApiBaseUrl)
         .withExpectStatus([200])
         .withBufferJsonResponseHandler()
         .withTimeout(config.httpTimeoutMillis)
         .withAgentOptions({keepAlive: true});

    }

    // Webhooks

    getAllWebhooksPromise() {
        return getAllWebhooksPromise(null)
    }

    getAllWebhooksPromise(nextCursor) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }
        query.includeExpiredSubscriptions = true

        return this.httpClient
            .withPath('/api/v1/webhooks/call-events')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    getWebhookByIdPromise(webhookId) {
        return this.httpClient
            .withPath('/api/v1/webhooks/call-events/' + webhookId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    deleteWebhookByIdPromise(webhookId) {
        return this.httpClient
            .withPath('/api/v1/webhooks/call-events/' + webhookId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodDelete()
            .send()
            .then(response => response.body);
    }

    createWebhookPromise(label, url, optionalUrlAuthenticationToken) {
        var webhookPrecursor = {}
        
        webhookPrecursor.label = label
        webhookPrecursor.url = url
        webhookPrecursor.authentication = {}
        
        if (optionalUrlAuthenticationToken != null) {
            webhookPrecursor.authentication.type = 'token'
            webhookPrecursor.authentication.token = optionalUrlAuthenticationToken;
        } else {
            webhookPrecursor.authentication.type = 'none'
        }
        
        return this.httpClient
            .withPath('/api/v1/webhooks/call-events')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withJsonBody(webhookPrecursor)
            .withMethodPost()
            .send()
            .then(response => response.body);
    }

    // subscriptions

    getWebhookSubscriptionsPromise(webhookId, nextCursor) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }
        query.includeExpiredSubscriptions = true

        return this.httpClient
            .withPath('/api/v1/webhooks/call-events/' + webhookId + '/subscriptions')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    getWebhookSubscriptionByIdPromise(webhookId, subscriptionId) {
        return this.httpClient
            .withPath('/api/v1/webhooks/call-events/' + webhookId + '/subscriptions/' + subscriptionId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    deleteWebhookSubscriptionByIdPromise(webhookId, subscriptionId) {
        return this.httpClient
            .withPath('/api/v1/webhooks/call-events/' + webhookId + '/subscriptions/' + subscriptionId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodDelete()
            .send()
            .then(response => response.body);
    }

    deleteAllWebhookSubscriptionPromise(webhookId) {
        return this.httpClient
            .withPath('/api/v1/webhooks/call-events/' + webhookId + '/subscriptions')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodDelete()
            .send()
            .then(response => response.body);
    }

    createWebhookSubscriptionsPromise(webhookId, listOfUserIds, listEventTypes, optionalExpirationDate) {
        var subscriptionsPrecursor = {}

        if (optionalExpirationDate != null) {
            subscriptionsPrecursor.expires = optionalExpirationDate
        }
        subscriptionsPrecursor.userIds = listOfUserIds;
        subscriptionsPrecursor.eventTypes = listEventTypes;
        
        console.log(JSON.stringify(subscriptionsPrecursor))
        return this.httpClient
            .withPath('/api/v1/webhooks/call-events/' + webhookId + '/subscriptions')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withJsonBody(subscriptionsPrecursor)
            .withMethodPost()
            .send()
            .then(response => response.body);
    }
}

module.exports = CallEventsConnector;

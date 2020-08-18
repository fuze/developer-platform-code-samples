const httplease = require("httplease");

class CallsConnector {
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

    getAllCallsPromise() {
        return getAllCallsPromise(null)
    }

    getAllCallsPromise(nextCursor) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }

        return this.httpClient
            .withPath('/api/v1/calls/')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    getCallPromise(callId) {
        return this.httpClient
            .withPath('/api/v1/calls/' + callId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    getCallRecordingsPromise(callId, nextCursor) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }

        return this.httpClient
            .withPath('/api/v1/calls/' + callId + '/call-recordings')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withMethodGet()
            .send()
            .then(response => response.body);
    }
    
}

module.exports = CallsConnector;

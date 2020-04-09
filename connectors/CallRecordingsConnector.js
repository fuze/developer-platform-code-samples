const httplease = require("httplease");

class CallRecordingsConnector {
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

    getAllCallRecsPromise() {
        return getAllCallRecs(null)
    }

    getAllCallRecsPromise(nextCursor) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }

        return this.httpClient
            .withPath('/api/v1/call-recordings/')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    getCallRecPromise(recordingId) {
        return this.httpClient
            .withPath('/api/v1/call-recordings/' + recordingId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withMethodGet()
            .send();
    }

    downloadCallRecPromise(recordingId, responseHandler) {
        return this.httpClient
            .withPath('/api/v1/call-recordings/' + recordingId + '/media')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withExpectStatus([307])
            .withMethodGet()
            .send()
            .then(redirection => {
                return httplease.builder()
                    .withPath(redirection.headers.location)
                    .withTimeout(5000)
                    .withExpectStatus([200])
                    .withMethodGet()
                    .withResponseHandler(responseHandler)
                    .send()
            })
    }
}

module.exports = CallRecordingsConnector;

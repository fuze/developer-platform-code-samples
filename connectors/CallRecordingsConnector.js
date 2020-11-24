const httplease = require("httplease");

class CallRecordingsConnector {
  constructor(config) {
     this.authToken = config.authToken;
     this.fuzeApiBaseUrl = config.fuzeApiBaseUrl
     this.httpTimeoutMillis = config.httpTimeoutMillis
     this.pageSize = 100;

     this.httpClient = httplease.builder()
         .withBaseUrl(this.fuzeApiBaseUrl)
         .withExpectStatus([200])
         .withBufferJsonResponseHandler()
         .withTimeout(this.httpTimeoutMillis)
         .withAgentOptions({keepAlive: true});

    }

    getAllCallRecsPromise() {
        return getAllCallRecs(null, null, null)
    }

    getAllCallRecsPromise(nextCursor, optionalAfter, optionalBefore) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }
        if (optionalAfter != null) {
            query.after = optionalAfter
        }
        if (optionalBefore != null) {
            query.before = optionalBefore
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
            .send()
            .then(response => response.body);
    }

    downloadCallRecPromise(recordingId, responseHandler) {
        var downloadHttpClient = httplease.builder()
             .withBaseUrl(this.fuzeApiBaseUrl)
             .withExpectStatus([200])
             .withBufferJsonResponseHandler()
             .withTimeout(this.httpTimeoutMillis)
             .withAgentOptions({keepAlive: true});

        return downloadHttpClient
            .withPath('/api/v1/call-recordings/' + recordingId + '/media')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withExpectStatus([307])
            .withMethodGet()
            .send()
            .then(redirection => {
                return httplease.builder()
                    .withPath(redirection.headers.location)
                    .withTimeout(this.httpTimeoutMillis)
                    .withExpectStatus([200])
                    .withMethodGet()
                    .withResponseHandler(responseHandler)
                    .send()
            })
    }
}

module.exports = CallRecordingsConnector;

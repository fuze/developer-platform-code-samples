const httplease = require("httplease");

class JobsConnector {
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

    getJobDetailsPromise(jobId) {

        return this.httpClient
            .withPath('/api/v1/jobs/' + jobId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodGet()
            .withExpectStatus([200])
            .send()
            .then(response => response.body.data);
    }
}

module.exports = JobsConnector;
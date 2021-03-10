const httplease = require("httplease");

class CallManagementConnector {
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

    // place a call

    startCallPromise(userId, numberToCall, optionalDevice) {
        var callPrecursor = {}
        
        callPrecursor.userId = userId
        callPrecursor.destinationNumber = numberToCall
        if (optionalDevice != null) {
            callPrecursor.device = optionalDevice
        }
        
        return this.httpClient
            .withPath('/api/v1/call-management/call')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withJsonBody(callPrecursor)
            .withExpectStatus([200, 202])
            .withMethodPost()
            .send()
            .then(response => response.body);
    }

    // list ongoing or related calls

    listUserOngoingCallsPromise(userId) {
        var query = {}
        query.userId = userId

        return this.httpClient
            .withPath('/api/v1/call-management/list-calls')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    listUserRelatedCallsPromise(userId) {
        var query = {}
        query.userId = userId

        return this.httpClient
            .withPath('/api/v1/call-management/related-calls')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    // hangup call

    hangupCallPromise(callId) {
        var callPrecursor = {}
        callPrecursor.callId = callId
        
        return this.httpClient
            .withPath('/api/v1/call-management/hangup')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withJsonBody(callPrecursor)
            .withMethodPost()
            .withExpectStatus([202])
            .send()
            .then(response => response.body);
    }

    // transfer call

    transferCallPromise(callId, destinationNumber) {
        var callPrecursor = {}
        callPrecursor.callId = callId
        callPrecursor.transferToNumber = destinationNumber
        
        return this.httpClient
            .withPath('/api/v1/call-management/transfer')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withJsonBody(callPrecursor)
            .withMethodPost()
            .withExpectStatus([202])
            .send()
            .then(response => response.body);
    }

    // hold / unhold calls

    holdCallPromise(callId) {
        var callPrecursor = {}
        callPrecursor.callId = callId
        
        return this.httpClient
            .withPath('/api/v1/call-management/hold')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withJsonBody(callPrecursor)
            .withMethodPost()
            .withExpectStatus([202])
            .send()
            .then(response => response.body);
    }

    unholdCallPromise(callId, userId) {
        var callPrecursor = {}
        callPrecursor.callId = callId
        callPrecursor.userId = userId
        
        return this.httpClient
            .withPath('/api/v1/call-management/unhold')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withJsonBody(callPrecursor)
            .withMethodPost()
            .withExpectStatus([202])
            .send()
            .then(response => response.body);
    }

    // pause/resume call recordings

    pauseCallRecordingPromise(callId) {
        var callPrecursor = {}
        callPrecursor.callId = callId
        
        return this.httpClient
            .withPath('/api/v1/call-management/pause-recording')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withJsonBody(callPrecursor)
            .withMethodPost()
            .withExpectStatus([202])
            .send()
            .then(response => response.body);
    }

    resumeCallRecordingPromise(callId) {
        var callPrecursor = {}
        callPrecursor.callId = callId
        
        return this.httpClient
            .withPath('/api/v1/call-management/resume-recording')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withJsonBody(callPrecursor)
            .withMethodPost()
            .withExpectStatus([202])
            .send()
            .then(response => response.body);
    }
}

module.exports = CallManagementConnector;

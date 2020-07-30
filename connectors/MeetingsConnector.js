
const httplease = require("httplease");
class MeetingsConnector {
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

    getMeetingsPromise() {
        getMeetingsPromise(null)
    }

    getMeetingsPromise(cursor) {
        var query = {}
        query.limit = this.pageSize;
        if (cursor != null) {
            query.cursor = cursor
        }

        return this.httpClient
            .withPath('/api/v1/meetings')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(meetingsPaginatedResponse => {
                return meetingsPaginatedResponse.body;
            });
    }

    getMeetingPromise(meetingId) {
        return this.httpClient
            .withPath('/api/v1/meetings/' + meetingId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withMethodGet()
            .send()
            .then(meetingResponse => {
                return meetingResponse.body.data;
            });
    }

    deleteMeetingPromise(meetingId) {
        return this.httpClient
            .withPath('/api/v1/meetings/' + meetingId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withMethodDelete()
            .send()
            .then(meetingResponse => {
                return meetingResponse.body.data;
            });
    }

    createMeetingPromise(meeting) {
        return this.httpClient
            .withPath('/api/v1/meetings')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withJsonBody(meeting)
            .withMethodPost()
            .send()
            .then(meetingResponse => {
                return meetingResponse.body.data;
            });
    }
}

module.exports = MeetingsConnector;

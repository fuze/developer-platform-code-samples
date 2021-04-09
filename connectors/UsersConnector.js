
const httplease = require("httplease");
class UsersConnector {
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

    getUsersPromise() {
        getUsersPromise(null)
    }

    getUsersPromise(cursor) {
        var query = {}
        query.limit = this.pageSize;
        if (cursor != null) {
            query.cursor = cursor
        }

        return this.httpClient
            .withPath('/api/v1/users/')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(usersPaginatedResponse => {
                return usersPaginatedResponse.body;
            });
    }

    getUserPromise(userId) {
        return this.httpClient
            .withPath('/api/v1/users/' + userId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withMethodGet()
            .send()
            .then(userResponse => {
                return userResponse.body.data;
            });
        }

    deprovisionUserPromise(userId, managerUserId, forwardingSku) {
        var request = {}

        if (managerUserId != null && forwardingSku != null) {
            request.managerUserId = managerUserId
            request.forwardingSku = forwardingSku
        }

        return this.httpClient
            .withPath('/api/v1/users/' + userId + "/deprovision")
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodPost()
            .withJsonBody(request)
            .withExpectStatus([202])
            .send()
            .then(userResponse => {
                return userResponse.body.data;
            });
    }

    // presence

    getUserPresencePromise(userId) {
        
        return this.httpClient
            .withPath('/api/v1/users/' + userId + "/presence")
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodGet()
            .send()
            .then(userResponse => {
                return userResponse.body.data;
            });
    }

    getUserPresenceSessionsPromise(userId, cursor) {
        var query = {}
        query.limit = this.pageSize;
        if (cursor != null) {
            query.cursor = cursor
        }

        return this.httpClient
            .withPath('/api/v1/users/' + userId + '/presence/sessions')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(sessionsPaginatedResponse => {
                return sessionsPaginatedResponse.body;
            });
    }

    createUserPresenceSessionPromise(userId, originRequester, originVersion, heartbeat, status, optionalTags) {
        var request = {}
        request.originRequester = originRequester
        request.originVersion = originVersion
        request.heartbeat = heartbeat
        request.presence = {}
        request.presence.status = status
        request.presence.passive = false
        if (optionalTags != null) {
            request.presence.tags = optionalTags;
        }

        return this.httpClient
            .withPath('/api/v1/users/' + userId + "/presence/sessions")
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodPost()
            .withJsonBody(request)
            .withExpectStatus([200])
            .send()
            .then(sessionResponse => {
                return sessionResponse.body.data;
            });
    }

    updateUserPresenceSessionPromise(userId, sessionId, heartbeat, status, optionalTags) {
        var request = {}
        request.heartbeat = heartbeat
        request.presence = {}
        request.presence.status = status
        request.presence.passive = false
        if (optionalTags != null) {
            request.presence.tags = optionalTags;
        }

        return this.httpClient
            .withPath('/api/v1/users/' + userId + "/presence/sessions/" + sessionId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodPut()
            .withJsonBody(request)
            .withExpectStatus([200])
            .send()
            .then(sessionResponse => {
                return sessionResponse.body.data;
            });
    }

    deleteUserPresenceSessionPromise(userId, sessionId) {

        return this.httpClient
            .withPath('/api/v1/users/' + userId + "/presence/sessions/" + sessionId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodDelete()
            .withExpectStatus([200])
            .send()
            .then(sessionResponse => {
                return sessionResponse.body.data;
            });
    }
}

module.exports = UsersConnector;

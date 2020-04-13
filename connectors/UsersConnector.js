
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
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
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
}

module.exports = UsersConnector;
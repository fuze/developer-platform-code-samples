const httplease = require("httplease");

class NumberBlockingConnector {
    constructor(config) {
        this.authToken = config.authToken;
        this.pageSize = 100;
        this.httpClient = httplease.builder()
            .withBaseUrl(config.fuzeApiBaseUrl)
            .withExpectStatus([200])
            .withBufferJsonResponseHandler()
            .withTimeout(config.httpTimeoutMillis)
            .withAgentOptions({ keepAlive: true });

    }

    async addBlockedNumber(userId, phoneNumber, direction) {
        let requestBody = {}
        requestBody.phoneNumber = phoneNumber
        requestBody.direction = direction;

        console.log(JSON.stringify(requestBody))

        return this.httpClient
            .withPath('/api/v1/users/' + userId + '/blocked-numbers')
            .withHeaders({ 'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding': 'string' })
            .withJsonBody(requestBody)
            .withMethodPost()
            .send()
            .then(response => response.body);
    }

    async deleteBlockedNumber(userId, phoneNumber) {

        return this.httpClient
            .withPath('/api/v1/users/' + userId + '/blocked-numbers/' + phoneNumber)
            .withHeaders({ 'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding': 'string' })
            .withMethodDelete()
            .send()
            .then(response => response.body);
    }

    async deleteAllBlockedNumber(userId) {

        return this.httpClient
            .withPath('/api/v1/users/' + userId + '/blocked-numbers/')
            .withHeaders({ 'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding': 'string' })
            .withMethodDelete()
            .send()
            .then(response => response.body);
    }

    async getAllNumbersPromise(userId, nextCursor) {
        let query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }

        return this.httpClient
            .withPath('/api/v1/users/' + userId + '/blocked-numbers')
            .withHeaders({ 'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding': 'string' })
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }
}

module.exports = NumberBlockingConnector;
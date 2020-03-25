
const httplease = require("httplease");
class DepartmentsConnector {
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

    getDepartmentsPromise() {
        getDepartmentsPromise(null)
    }

    getDepartmentsPromise(cursor) {
        var query = {}
        query.limit = this.pageSize;
        if (cursor != null) {
            query.cursor = cursor
        }

        return this.httpClient
            .withPath('/api/v1/departments/')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(departmentsPaginatedResponse => {
                return departmentsPaginatedResponse.body;
            });
    }

    getLocationPromise(locationId) {
        return this.httpClient
            .withPath('/api/v1/departments/' + locationId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withMethodGet()
            .send()
            .then(locationResponse => {
                return locationResponse.body.data;
            });
        }
}

module.exports = DepartmentsConnector;

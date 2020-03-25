
const httplease = require("httplease");
class OrganizationsConnector {
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

    getOrganizationsPromise() {
        getOrganizationsPromise(null)
    }

    getOrganizationsPromise(cursor) {
        var query = {}
        query.limit = this.pageSize;
        if (cursor != null) {
            query.cursor = cursor
        }

        return this.httpClient
            .withPath('/api/v1/organizations/')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(organizationsPaginatedResponse => {
                return organizationsPaginatedResponse.body;
            });
    }

    getOrganizationPromise(organizationCode) {
        return this.httpClient
            .withPath('/api/v1/organizations/' + organizationCode)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withMethodGet()
            .send()
            .then(organizationResponse => {
                return organizationResponse.body.data;
            });
        }
}

module.exports = OrganizationsConnector;

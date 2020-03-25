
const httplease = require("httplease");
class LocationsConnector {
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

    getLocationsPromise() {
        getLocationsPromise(null)
    }

    getLocationsPromise(cursor) {
        var query = {}
        query.limit = this.pageSize;
        if (cursor != null) {
            query.cursor = cursor
        }

        return this.httpClient
            .withPath('/api/v1/locations/')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(locationsPaginatedResponse => {
                return locationsPaginatedResponse.body;
            });
    }

    getLocationPromise(locationId) {
        return this.httpClient
            .withPath('/api/v1/locations/' + locationId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken})
            .withMethodGet()
            .send()
            .then(locationResponse => {
                return locationResponse.body.data;
            });
        }
}

module.exports = LocationsConnector;

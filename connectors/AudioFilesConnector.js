const httplease = require("httplease");

class AudioFilesConnector {
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

    async getFilePromise(fileId) {

        return this.httpClient
            .withPath('/api/v1/audio-files/' + fileId)
            .withHeaders({ 'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding': 'string' })
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    async getFileUsesPromise(fileId) {

        return this.httpClient
            .withPath('/api/v1/audio-files/' + fileId + '/uses')
            .withHeaders({ 'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding': 'string' })
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    async listAllFilesPromise(searchParamsDict, nextCursor) {
        let query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }
        if (searchParamsDict.pbx != null) {
            query.pbx = searchParamsDict.pbx;
        }
        if (searchParamsDict.name != null) {
            query.name = searchParamsDict.name;
        }
        if (searchParamsDict.category != null) {
            query.category = searchParamsDict.category;
        }
        if (searchParamsDict.sortBy != null) {
            query.sortBy = searchParamsDict.sortBy;
        }
        if (searchParamsDict.order != null) {
            query.order = searchParamsDict.order;
        }

        return this.httpClient
            .withPath('/api/v1/audio-files/')
            .withHeaders({ 'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding': 'string' })
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    async deleteFilePromise(fileId) {

        return this.httpClient
            .withPath('/api/v1/audio-files/' + fileId)
            .withHeaders({ 'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding': 'string' })
            .withMethodDelete()
            .send()
            .then(response => response.body);
    }

    async downloadFilePromise(fileId) {

        return this.httpClient
            .withPath('/api/v1/audio-files/' + fileId + '/media')
            .withHeaders({ 'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding': 'string' , 'Accept': 'application/octet-stream'})
            .withMethodGet()
            .send()
            .then(response => response.body);
    }
    
}

module.exports = AudioFilesConnector;
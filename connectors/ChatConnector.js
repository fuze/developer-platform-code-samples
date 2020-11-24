const httplease = require("httplease");


class ChatConnector {
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

    getAllChatsPromise() {
        return getAllChatsPromise(null)
    }

    // chats / conversations

    getAllChatsPromise(nextCursor) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }

        return this.httpClient
            .withPath('/api/v1/chats/')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    getChatPromise(chatId) {
        return this.httpClient
            .withPath('/api/v1/chats/' + chatId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    // messages in a chat / conversation

    getChatMessagesPromise(chatId, nextCursor, optionalKind, optionalSender, optionalAfterDate, optionalBeforeDate) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }
        if (optionalKind != null) {
            query.kind = optionalKind
        }
        if (optionalSender != null) {
            query.sender = optionalSender
        }
        if (optionalAfterDate != null) {
            query.after = optionalAfterDate
        }
        if (optionalBeforeDate != null) {
            query.before = optionalBeforeDate
        }

        return this.httpClient
            .withPath('/api/v1/chats/' + chatId + '/messages')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    getChatMessagePromise(chatId, messageId) {
        return this.httpClient
            .withPath('/api/v1/chats/' + chatId + '/messages/' + messageId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodGet()
            .send()
            .then(response => response.body);
    }
    
    // get messages, optionally from a sender and inside a date range

    getMessagesFromAnyChatPromise(nextCursor, optionalSender, optionalAfterDate, optionalBeforeDate) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }
        if (optionalSender != null) {
            query.sender = optionalSender
        }
        if (optionalAfterDate != null) {
            query.after = optionalAfterDate
        }
        if(optionalBeforeDate != null) {
            query.before = optionalBeforeDate
        }

        return this.httpClient
            .withPath('/api/v1/chat-messages')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    // uploads

    getChatUploadsPromise(chatId, nextCursor, optionalAfterDate, optionalBeforeDate) {
        var query = {}
        query.limit = this.pageSize;
        if (nextCursor != null) {
            query.cursor = nextCursor
        }
        if (optionalAfterDate != null) {
            query.after = optionalAfterDate
        }
        if(optionalBeforeDate != null) {
            query.before = optionalBeforeDate
        }

        return this.httpClient
            .withPath('/api/v1/chats/' + chatId + '/uploads')
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withParams(query)
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    getChatUploadPromise(chatId, uploadId) {
        return this.httpClient
            .withPath('/api/v1/chats/' + chatId + '/uploads/' + uploadId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withMethodGet()
            .send()
            .then(response => response.body);
    }

    static followRedirectPromise(redirection, fileHandler) {
        
        if (redirection.statusCode == 200) {
            fileHandler(redirection)
            redirection.discard();
            return Promise.resolve();
        } else {
            console.log("Redirect: " + redirection.headers.location)

            return httplease.builder()
                .withPath(redirection.headers.location)
                .withTimeout(5000)
                .withExpectStatus([200, 307])
                .withResponseHandler((response) => ChatConnector.followRedirectPromise(response, fileHandler))
                .withMethodGet()
                .send()                
        }
    }

    downloadChatUploadPromise(chatId, uploadId, fileId, fileHandler) {
        return this.httpClient
            .withPath('/api/v1/chats/' + chatId + '/uploads/' + uploadId + "/files/" + fileId)
            .withHeaders({'Authorization': 'Bearer ' + this.authToken, 'X-Long-Encoding' : 'string'})
            .withExpectStatus([307])
            .withMethodGet()
            .send()
            .then(response => ChatConnector.followRedirectPromise(response, fileHandler))
    }
}

module.exports = ChatConnector;

// ----------------------------------------------------------------------------
// GET ONE CHAT METADATA BY ID
// ----------------------------------------------------------------------------
// This sample code retrieves one chat metadata when you pass its id
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
var fs = require("fs")
const ChatConnector = require('../connectors/ChatConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// Download one call recording
// ----------------------------------------------------------------------------
function downloadFile(chatId, uploadId, fileId, file) {

  if (!fs.existsSync(file)) {
    console.log("Download [chatId / uploadId / fileId] = " + chatId + " / " + uploadId + " / " + fileId)
    return connector
        .downloadChatUploadPromise(chatId, uploadId, fileId, (response) => response.pipe(fs.createWriteStream(file)))
        .catch(err => {
          console.error("Failed to download file " + file + " with id " + fileId + ": " + err.message)
          process.exit(1)
        })
        .then(_ => console.log(" Downloaded " + file))
  } else {
    console.log("Download of [chatId / uploadId / fileId] = " + chatId + " / " + uploadId + " / " + fileId + " NOT needed, file " + file + " already exists")
    return Promise.resolve()
  }
}


// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new ChatConnector(config)

if (process.argv.length < 4) {
  console.log("Invalid number of parameters... missing chat ID or upload ID\n\nUsage: node chats/06-download-one-chat-uploaded-file-by-id.js chatId uploadId\n\n")
} else {
  chatId = process.argv[2];
  uploadId = process.argv[3];

  connector.getChatUploadPromise(chatId, uploadId)
    .catch(err => HttpErrorHandler.bailOut(err, "chat_messages_read"))
    .then(body => body.data.files.forEach(u => {
      return downloadFile(chatId, uploadId, u.fileId, u.name)
    }))
}
// ----------------------------------------------------------------------------
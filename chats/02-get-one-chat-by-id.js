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
const ChatConnector = require('../connectors/ChatConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// show chat information
// ----------------------------------------------------------------------------
function showChatInfo(body) {
  chat = body.data
  console.log("chat id " + chat.id);
  console.log(JSON.stringify(chat, null, 2))
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new ChatConnector(config)

if (process.argv.length < 3) {
  console.log("Invalid number of parameters... missing chat ID")
} else {
  chatId = process.argv[2];

  connector.getChatPromise(chatId)
    .catch(err => HttpErrorHandler.bailOut(err, "chat_messages_read"))
    .then(body => showChatInfo(body))
}
// ----------------------------------------------------------------------------
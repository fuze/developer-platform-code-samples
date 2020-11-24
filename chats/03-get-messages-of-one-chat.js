// ----------------------------------------------------------------------------
// GET CHAT MESSAGES OF ONE CHAT SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code lists all messages on a chat.

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const StringBuilder = require('node-stringbuilder')
const ChatConnector = require('../connectors/ChatConnector')
const HttpErrorHandler = require('../utils/Errors.js')

var connector = new ChatConnector(config)
var pageCounter = 0;
var messagesCounter = 0;

// ----------------------------------------------------------------------------
// log postDate, author, messageId and content of a page of messages
// ----------------------------------------------------------------------------
function showMessagesInPage(messagesList) {
  
  var messageLines = new StringBuilder();
  
  messagesList.forEach(function (m) {
    var line = new StringBuilder()
    
    line.append(m.id);
    line.append(", ");
    
    line.append(m.postedAt.padEnd(29, ' '));
    line.append(", ");
    
    line.append(m.kind.padEnd(8, ' '));
    line.append(", ");

    line.append(m.author.type);
    line.append("_");
    if (m.author.type == "user") {
      line.append(m.author.userId);
    } else {
      line.append("-".padEnd(18, '-'));
    }
    line.append(", ");

    if (m.kind == "message") {    
      line.append(m.content);
    } else {
      line.append("-".padEnd(18, '-'));
    }
    
    messageLines.append(line).append('\n');
  })

  console.log(messageLines.toString());
}

// ----------------------------------------------------------------------------
// Recursively get pages of messages from one chat.
// This function returns a promise with the number of messages in the chat.
// ----------------------------------------------------------------------------
function getAllMessagesOfChatPromise(chatId, cursor, optionalSenderId, optionalAfter, optionalBefore) {
  return connector.getChatMessagesPromise(chatId, cursor, null, optionalSenderId, optionalAfter, optionalBefore)
    .catch(err => HttpErrorHandler.bailOut(err, "chat_messages_read"))
    .then(bodyWithPageOfMessages => {
      console.log("\nPage " + (++pageCounter) + " with " + bodyWithPageOfMessages.data.length + " messages");
      
      showMessagesInPage(bodyWithPageOfMessages.data)
      messagesCounter = messagesCounter + bodyWithPageOfMessages.data.length;

      if (bodyWithPageOfMessages.pagination.cursor != null) {
        return getAllMessagesOfChatPromise(chatId, bodyWithPageOfMessages.pagination.cursor, optionalSenderId)
      } else {
        return Promise.resolve(messagesCounter)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
if (process.argv.length < 3) {
  console.log("Invalid number of parameters... missing chat ID\n\nUsage: node chats/03-get-messages-of-one-chat.js chatId [afterDate] [beforeDate] [senderId]\n"
            + "       All arguments are optional, dates should be RFC3339 formatted")
} else {
  chatId = process.argv[2];
  senderId = null
  optionalAfter = null
  optionalBefore = null

  if (process.argv.length > 3) {
    optionalAfter = process.argv[3]

    if (process.argv.length > 4) {
      optionalBefore = process.argv[4]

      if (process.argv.length > 5) {
        senderId = process.argv[5]
      }
    }
  }
  getAllMessagesOfChatPromise(chatId, null, senderId, optionalAfter, optionalBefore)
    .then(counter => console.log("Found a total of " + counter + " messages in chat " + chatId))
}
// ----------------------------------------------------------------------------

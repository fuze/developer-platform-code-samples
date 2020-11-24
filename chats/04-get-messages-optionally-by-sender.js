// ----------------------------------------------------------------------------
// GET CHAT MESSAGES BETWEEN DATES AND/OR BY SENDER
// ----------------------------------------------------------------------------
// This sample code lists all messages, regardless of the chat

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
// Recursively get pages of messages.
// This function returns a promise with the number of messages it found.
// ----------------------------------------------------------------------------
function getMessagesPromise(cursor, optionalSenderId, optionalAfter, optionalBefore) {
  return connector.getMessagesFromAnyChatPromise(cursor, optionalSenderId, optionalAfter, optionalBefore)
    .catch(err => HttpErrorHandler.bailOut(err, "chat_messages_read"))
    .then(bodyWithPageOfMessages => {
      console.log("\nPage " + (++pageCounter) + " with " + bodyWithPageOfMessages.data.length + " messages");
      
      showMessagesInPage(bodyWithPageOfMessages.data)
      messagesCounter = messagesCounter + bodyWithPageOfMessages.data.length;

      if (bodyWithPageOfMessages.pagination.cursor != null) {
        return getMessagesPromise(bodyWithPageOfMessages.pagination.cursor, optionalSenderId, optionalAfter, optionalBefore)
      } else {
        return Promise.resolve(messagesCounter)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

console.log("Usage: node chats/04-get-messages-optionally-by-sender.js [afterDate] [beforeDate] [senderId]\n"
          + "       All arguments are optional, dates should be RFC3339 formatted\n"
          + "       Dates afterDate and beforeDate must either both be present or both not present")

senderId = null
optionalAfter = null
optionalBefore = null

if (process.argv.length > 2) {
  optionalAfter = process.argv[2]

  if (process.argv.length > 3) {
    optionalBefore = process.argv[3];
    
    if (process.argv.length > 4) {
      senderId = process.argv[4];
    }
  }
}

getMessagesPromise(null, senderId, optionalAfter, optionalBefore)
  .then(counter => console.log("Found a total of " + counter + " messages"))

// ----------------------------------------------------------------------------

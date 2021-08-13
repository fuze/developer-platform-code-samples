// ----------------------------------------------------------------------------
// GET CHAT UPLOADS OF ONE CHAT SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code lists all uploads on a chat.

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
// log postDate, author, and extra details of a page of uploads
// ----------------------------------------------------------------------------
function showUploadsInPage(messagesList) {
  
  var uploadLines = new StringBuilder();
  
  messagesList.forEach(function (m) {
    var line = new StringBuilder()
    
    line.append(m.id);
    line.append(", ");
    
    line.append(m.postedAt.padEnd(29, ' '));
    line.append(", ");

    line.append(m.author.type);
    line.append("_");
    if (m.author.type == "user") {
      line.append(m.author.userId);
    } else {
      line.append("-".padEnd(18, '-'));
    }
    line.append(", ");

    m.files.forEach(u => {
      line.append("fileId: ")
      line.append(u.fileId)
      line.append(", file: ")
      line.append(u.name)
      line.append(", ")
    })
    
    uploadLines.append(line).append('\n');
  })

  console.log(uploadLines.toString());
}

// ----------------------------------------------------------------------------
// Recursively get pages of uploads from one chat.
// This function returns a promise with the number of uploads in the chat.
// ----------------------------------------------------------------------------
function getAllUploadsOfChatPromise(chatId, cursor, optionalAfter, optionalBefore) {
  return connector.getChatUploadsPromise(chatId, cursor, optionalAfter, optionalBefore)
    .catch(err => HttpErrorHandler.bailOut(err, "chat_messages_read"))
    .then(bodyWithPageOfUploads => {
      console.log("\nPage " + (++pageCounter) + " with " + bodyWithPageOfUploads.data.length + " uploads");
      
      showUploadsInPage(bodyWithPageOfUploads.data)
      messagesCounter = messagesCounter + bodyWithPageOfUploads.data.length;

      if (bodyWithPageOfUploads.pagination.cursor != null) {
        return getAllUploadsOfChatPromise(chatId, bodyWithPageOfUploads.pagination.cursor, optionalAfter, optionalBefore)
      } else {
        return Promise.resolve(messagesCounter)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
if (process.argv.length < 3) {
  console.log("Invalid number of parameters... missing chat ID\n\nUsage: node chats/05-get-uploads-of-one-chat.js chatId [afterDate] [beforeDate]\n")
} else {
  chatId = process.argv[2];
  optionalAfter = null
  optionalBefore = null

  if (process.argv.length > 3) {
      optionalAfter = process.argv[3]

      if (process.argv.length > 4) {
        optionalBefore = process.argv[4]
      }
  }

  getAllUploadsOfChatPromise(chatId, null, optionalAfter, optionalBefore)
    .then(counter => console.log("Found a total of " + counter + " uploads in chat " + chatId))
}
// ----------------------------------------------------------------------------

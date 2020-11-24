// ----------------------------------------------------------------------------
// GET CHAT MESSAGES BETWEEN DATES AND/OR BY SENDER
// ----------------------------------------------------------------------------
// This sample code is a generic chat messages exporter
// Notes:
// - The API will default to a date range of the "last 24 hours" unless you
// pass the optionalAfter optionalBefore dates
// - The maximum allowed date range are 90 days
// - If you don't pass a senderId, messages inside the date range,
// from everybody in the organization will be returned


// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const fs = require('fs')
const readlineSync = require('readline-sync')
const StringBuilder = require('node-stringbuilder')
const ChatConnector = require('../connectors/ChatConnector')
const HttpErrorHandler = require('../utils/Errors.js')

var connector = new ChatConnector(config)
var pageCounter = 0;
var messagesCounter = 0;

// ----------------------------------------------------------------------------
// File open/close functions for proper JSON writing
// ----------------------------------------------------------------------------
var outputStream = null
function openJsonFile(filename, shouldTruncateFile) {
  try {
    fs.accessSync(filename, fs.constants.R_OK | fs.constants.W_OK);
  } catch (err) {
    if (err.code != "ENOENT") {
      console.error("\nCannot access file " + filename + ": " + err);
      process.exit(1)
    }
  }


  if (shouldTruncateFile) {
    fs.truncateSync(filename);
  }

  try {
    outputStream = fs.createWriteStream(filename);
  } catch (err) {
    console.error("\nCannot open file " + filename + " to write: " + err);
    process.exit(1)
  }
  outputStream.write("[\n");
}

function closeJsonFile() {
  outputStream.write("\n]");
  outputStream.close();
}

// ----------------------------------------------------------------------------
// Write Json messages to file
// ----------------------------------------------------------------------------
var firstPage = true;
function appendMessagesToFile(messagesList) {
   messagesList.forEach(m => {
    if (firstPage) {
      // don't write a comma before writing the message JSON element
      firstPage = false;
    } else {
      outputStream.write(",\n")
    }

    debugMsg(m)
    outputStream.write(JSON.stringify(m, null, 2))
  })
}

// ----------------------------------------------------------------------------
// Debug to console
// ----------------------------------------------------------------------------
function debugMsg(m) {
  
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
  
  console.log(line.toString())
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
      
      appendMessagesToFile(bodyWithPageOfMessages.data)
      messagesCounter = messagesCounter + bodyWithPageOfMessages.data.length;

      if (bodyWithPageOfMessages.pagination.cursor != null) {
        return getMessagesPromise(bodyWithPageOfMessages.pagination.cursor, optionalSenderId, optionalAfter, optionalBefore)
      } else {
        closeJsonFile()
        return Promise.resolve(messagesCounter)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

console.log("Usage: node chats/07-download-messages-from-sender-to-file.js filename [afterDate] [beforeDate] [senderId]\n"
          + "       Dates should be in RFC3339 format and are optional")

// mandatory
filename = null
senderId = null

// optional
optionalAfter = null
optionalBefore = null

if (process.argv.length > 2) {
  filename = process.argv[2]

  if (process.argv.length > 3) {
    optionalAfter = process.argv[3];
    
    if (process.argv.length > 4) {
      optionalBefore = process.argv[4];

      if (process.argv.length > 5) {
        senderId = process.argv[5]
      }
    }
  }

  if (fs.existsSync(filename)) {
    var resp = readlineSync.question("File " + filename + " already exists, do you want to overwrite it (Y/n) ?")
    if (resp == null || resp.trim() == "" || resp == "Y" || resp == "y") {
      openJsonFile(filename, true)
    } else {
      console.log("Please provide another filename and try again")
      process.exit(1);
    }
  } else {
    openJsonFile(filename, false)
  }
  

  getMessagesPromise(null, senderId, optionalAfter, optionalBefore)
  .then(counter => console.log("Found a total of " + counter + " messages sent by user " + senderId))
}


// ----------------------------------------------------------------------------

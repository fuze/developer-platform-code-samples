// ----------------------------------------------------------------------------
// GET ALL CHATS SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample code lists all chats that exist on your organization.

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
var chatIdentifiers = []

// ----------------------------------------------------------------------------
// log chat identifier and participants for a page of chats
// ----------------------------------------------------------------------------
function showChatIdentifiersAndParticipants(chatsList) {
  var chatDescriptions = new StringBuilder()
  
  chatsList.forEach(function (c) {
    var chatDesc = new StringBuilder()
    chatDesc.append("Id: ").append(c.id);
    
    chatDesc.append(', Participants: ')
    c.participants.forEach(p => {
      if (p.userId != null) {
        chatDesc.append(p.userId)
        chatDesc.append(", ");
      }
    })
    
    chatDescriptions.append(chatDesc).append('\n');
  })

  console.log(chatDescriptions.toString())
}

// ----------------------------------------------------------------------------
// keep chat identifiers from a page of chats
// ----------------------------------------------------------------------------
function keepchatIds(chatsList) {
  chatsList.forEach(function (c) {
    chatIdentifiers.push(c.id)
  })
}

// ----------------------------------------------------------------------------
// Recursively get pages of chats from the API.
// This function returns a promise with all the chat identifiers.
// ----------------------------------------------------------------------------
function getAllOrganizationChatsPromise(cursor) {
  return connector.getAllChatsPromise(cursor)
    .catch(err => HttpErrorHandler.bailOut(err, "chat_messages_read"))
    .then(bodyWithPageOfChats => {
      console.log("\nPage " + (++pageCounter) + " with " + bodyWithPageOfChats.data.length + " chats");
      
      showChatIdentifiersAndParticipants(bodyWithPageOfChats.data)
      keepchatIds(bodyWithPageOfChats.data)

      if (bodyWithPageOfChats.pagination.cursor != null) {
        return getAllOrganizationChatsPromise(bodyWithPageOfChats.pagination.cursor)
      } else {
        return Promise.resolve(chatIdentifiers)
      }
    })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
getAllOrganizationChatsPromise(null)
  .then(allChatIdentifiers => console.log("Found a total of " + allChatIdentifiers.length + " chats on your organization"))
// ----------------------------------------------------------------------------

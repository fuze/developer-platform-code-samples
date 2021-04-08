// ----------------------------------------------------------------------------
// GET ALL OF YOUR ORGANIZATION USERS' PRESENCE 
// ----------------------------------------------------------------------------
// This sample code shows how to get the presence status of each user of your
// organization
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const sprintf = require('sprintf-js').sprintf
const UsersConnector = require('../connectors/UsersConnector.js')
const HttpErrorHandler = require('../utils/Errors.js')

// ----------------------------------------------------------------------------
// Sequencially get the presence status of each user in the list
// ----------------------------------------------------------------------------
const MSG = "  %-30s %-50s:"
const MSG_TITLE = "  %-30s %-50s: Status"
function showPresence(users) {
    console.log(sprintf(MSG_TITLE, "Username", "First and Last name"))
    return users.reduce((p, user) => {
        if (user.active) {
            return p.then(() => {
                return connector
                    .getUserPresencePromise(user.userId)
                    .catch(err => {
                        console.error(sprintf(MSG + " (failed) HTTP status %s", user.userName, user.firstName + " " + user.lastName, HttpErrorHandler.getHttpError(err)))
                        return null;
                    })
                    .then(presence => {
                        if (presence != null) {
                            console.error(sprintf(MSG + " %s", user.userName, user.firstName + " " + user.lastName, presence.status))
                        }
                        return user.userId;
                    }
                )
            })
        } else {
            return p.then(() => {
                console.error(sprintf(MSG + " (inactive)", user.userName, user.firstName + " " + user.lastName))
                return Promise.resolve()
            })
        }
            
      },
      Promise.resolve()
    )
}


// ----------------------------------------------------------------------------
// Recursively get users from the API, one page at a time.
// This function returns a promise.
// ----------------------------------------------------------------------------
var totalUsers = 0;
var pageNumber = 0;
function getUserIdsOfOrganizationPromise(cursor) {
  return connector.getUsersPromise(cursor)
  .catch(err => HttpErrorHandler.bailOut(err, "presence_read"))
  .then(pageOfUsers => {
      console.log("\nPage " + ++pageNumber + " with " + pageOfUsers.data.length + " users")
      
      var users = pageOfUsers.data;
      totalUsers += users.length;    
      
      return showPresence(users)
        .then(nothing => {
            if (pageOfUsers.pagination.cursor != null) {
                return getUserIdsOfOrganizationPromise(pageOfUsers.pagination.cursor)
            } else {
                return Promise.resolve(totalUsers)
            }    
        });
  })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var connector = new UsersConnector(config)
getUserIdsOfOrganizationPromise(null)
  .then(totalUsers => console.log("\nGot the presence of " + totalUsers + " users"))
// ----------------------------------------------------------------------------

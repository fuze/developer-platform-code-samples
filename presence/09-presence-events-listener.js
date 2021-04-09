// ----------------------------------------------------------------------------
// PRESENCE EVENTS LISTENER SAMPLE CODE
// ----------------------------------------------------------------------------
// This sample program opens a TCP port and listens for presence events from
// Fuze Developer API.
//
// To use it you need to do the following:
//
// 1. Run this application on any machine making sure port 8089 is accessible
//    from the internet. You may change the port number in config.js.
//
// 2. Create a presence webhook on the Developer API, with the URL field
//    pointing to the machine where this sample program is running.
//    Example: http://yourmachine.corp.com:8089/presence
//    No authentication is needed to receive presence events on this app.
//
// 3. Add at least one presence subscription to the webhook, to be able to 
//    receive presence events
//
// 4. Change the presence of the user and see the presence messages printed 
//    by this application
//
// Notes: 
// 1) this sample program needs an integration token with organizations_read 
//    permission to be able to get user details (username)
// 2) the path used by this sample program is "/presence" and may be changed 
//    below on line 47

// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
const config = require('../config.js')

// ----------------------------------------------------------------------------
// Dependencies
// ----------------------------------------------------------------------------
const UsersConnector = require('../connectors/UsersConnector.js')
var usersConnector = new UsersConnector(config)

const express = require("express")
const bodyParser = require("body-parser-bigint")

// Tell express to use body-parser's JSON parsing
const app = express()
app.use(bodyParser.json())

app.post("/presence", (req, res) => {
        const { organization, notificationId, userId, changedAt, updatedAt, status, tags, description, quietMessage } = req.body;
        usersConnector.getUserPromise(userId)
                .catch(err => {console.err(`Error ${err}`)})
                .then(userDetails => {
                        console.log(`${changedAt} ${userId}/${userDetails.userName} is now ${status}` + (description != null ? ": " + description : ""))
                })

        res.status(200).end()
})

// Start express on the defined port
app.listen(config.listeningPort, () => console.log(`Server running on port ${config.listeningPort}`))


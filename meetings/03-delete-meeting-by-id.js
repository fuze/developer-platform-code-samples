// ----------------------------------------------------------------------------
// DELETE ONE MEETING BY ID
// ----------------------------------------------------------------------------
// This sample code deletes one meeting and returns its metadata
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (MeetingsConnector (httplease))
// ----------------------------------------------------------------------------
const httplease = require('httplease')
const MeetingsConnector = require('../connectors/MeetingsConnector.js')

// ----------------------------------------------------------------------------
// Very basic error handler
// ----------------------------------------------------------------------------
function bailOut(err) {
    if (err instanceof httplease.errors.UnexpectedHttpResponseCodeError) {
        if (err.response.statusCode == 401) {
            console.log("Not authorized, the api key in config.js seems invalid");
        } else if (err.response.statusCode == 403) {
            console.log("Forbidden, your token lacks the meetings_write permission");
        } else if (err.response.statusCode == 404) {
            console.log("Meeting not found");
        } else {
            console.log("HTTP error: " + err.response.statusCode);
            console.log(err.response.headers);
            console.log(err.response.body);
        }
    } else {
        console.log(err.message)
    }
    process.exit(1);
}

// ----------------------------------------------------------------------------
// show deleted meeting information
// ----------------------------------------------------------------------------
function showMeetingInfo(m) {
  console.log("meeting " + m.id + ", hosted by " + m.host + ", with subject " + m.subject + ", url " + m.accessUrl);
  console.log(m)
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var meetingsConnector = new MeetingsConnector(config)

if (process.argv.length < 3) {
  console.log("Invalid number of parameters... missing meeting ID")
} else {
  meetingId = process.argv[2];

  meetingsConnector.deleteMeetingPromise(meetingId)
    .catch(bailOut)
    .then(meeting => showMeetingInfo(meeting))
}
// ----------------------------------------------------------------------------

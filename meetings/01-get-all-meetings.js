// ----------------------------------------------------------------------------
// GET ALL MEETINGS OF YOUR ORGANIZATION
// ----------------------------------------------------------------------------
// This sample code retrieves all meetings' metadata of your organization.
//
// ----------------------------------------------------------------------------
// Configurations
// ----------------------------------------------------------------------------
var config = require('../config')

// ----------------------------------------------------------------------------
// Dependencies (MeetingsConnector (httplease) and node-stringbuilder)
// ----------------------------------------------------------------------------
const httplease = require('httplease')
//const StringBuilder = require('node-stringbuilder')
const MeetingsConnector = require('../connectors/MeetingsConnector.js')

// ----------------------------------------------------------------------------
// Very basic error handler
// ----------------------------------------------------------------------------
function bailOut(err) {
    if (err instanceof httplease.errors.UnexpectedHttpResponseCodeError) {
        if (err.response.statusCode == 401) {
            console.log("Not authorized, the api key in config.js seems invalid");
        } else if (err.response.statusCode == 403) {
           console.log("Forbidden, your token lacks the meetings_read permission");
        } else {}
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
// show all meeting information from one page of the API
// ----------------------------------------------------------------------------
function showMeetingInfo(meetingsList) {
  meetingsList.forEach(m => console.log("meeting " + m.id + ", hosted by " + m.host + ", with subject " + m.subject + ", url " + m.accessUrl));
}

// ----------------------------------------------------------------------------
// Recursively get meetings from the API, one page at a time.
// This function returns a promise.
// ----------------------------------------------------------------------------
var allMeetings = new Set();
var pageNumber = 0;
function getAllMeetings(cursor) {
  return meetingsConnector.getMeetingsPromise(cursor)
  .catch(bailOut)
  .then(pageOfMeetings => {
      console.log("\nPage " + ++pageNumber + " with " + pageOfMeetings.data.length + " meetings")
      pageOfMeetings.data.forEach(m => allMeetings.add(m))
      showMeetingInfo(pageOfMeetings.data);

      if (pageOfMeetings.pagination.cursor != null) {
        return getAllMeetings(pageOfMeetings.pagination.cursor)
      } else {
        return Promise.resolve(allMeetings)
      }
  })
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var meetingsConnector = new MeetingsConnector(config)

getAllMeetings(null)
  .then(meetings => console.log("\nYour organization currently has " + meetings.size + " meetings"))
// ----------------------------------------------------------------------------

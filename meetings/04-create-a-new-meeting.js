// ----------------------------------------------------------------------------
// CREATE A NEW MEETING
// ----------------------------------------------------------------------------
// This sample code asks for several parameters and creates a new meeting
// in your organization
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
        } else {
            console.log("HTTP error: " + err.response.statusCode);
            //console.log(err.response.headers);
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

function getSubject(argv) {
  if (argv.length > 4) {
    return argv[5]
  } else {
    return "My Code Sample Meeting"
  }
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
var meetingsConnector = new MeetingsConnector(config)

if (process.argv.length < 3) {
  console.log("Invalid number of parameters...\nParameters: host startTime endTime [subject]\n")
  console.log("'host'       the userId of the owner of the meeting, ie, one userId of your organization")
  console.log("'startTime'  the date and time at which your meeting will start in ISO8601 format, eg, 2020-08-25T14:30:00.000-04:00")
  console.log("'endTime'    the date and time at which your meeting will end in ISO8601 format, eg, 2020-08-25T15:00:00.000-04:00")
  console.log("'subject'    the title/subject of your meeting, surrounded by double quotes")
} else {
  host = process.argv[2];
  startTime = process.argv[3];
  endTime = process.argv[4];
  subject = getSubject(process.argv);

  meetingPrecursor = {
    'host': host,
    'startTime' : startTime,
    'endTime' : endTime,
    'subject' : subject
  }

  console.log("Going to create meeting: " + JSON.stringify(meetingPrecursor))

  meetingsConnector.createMeetingPromise(meetingPrecursor)
    .catch(bailOut)
    .then(meeting => showMeetingInfo(meeting))
}
// ----------------------------------------------------------------------------
